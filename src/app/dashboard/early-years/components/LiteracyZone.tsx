
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PHONICS_DATA, INITIAL_WORDS, VOWELS_CONSONANTS, DICTION_DATA, READING_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, GRAMMAR_DATA, OPPOSITES_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA } from '../constants';
import { generateLessonImage, generateTTS, generateRhyme, generateSongVideo } from '../services/gemini';
import { playRawPcm } from '../services/audio';
import { GoogleGenAI } from "@google/generative-ai";

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
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  
  const playQuestion = async (q: string) => { await playRawPcm(await generateTTS(q) || ''); };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Create a nursery storytelling scene prompt and 3 guided questions for topic "${aiTopic}". JSON: { "title": string, "prompt": string, "questions": [string, string, string] }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]);
      setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTopic('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Story Prompt</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase tracking-tighter text-center">Look & Tell a Story! 🗨️</h3>
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group" onClick={async () => playRawPcm(await generateTTS(`Let's look at this picture of ${current.title}! What do you see?`) || '')}>
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
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
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-3"><i className="fas fa-wand-magic-sparkles"></i> Story AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Scene Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Under the Sea" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE SCENE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase font-bold text-[10px] tracking-widest">Close</button></div></div></div>}
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
  
  const playWord = async (word: string) => { await playRawPcm(await generateTTS(word) || ''); };

  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    try {
       // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Generate a themed vocabulary set for topic "${aiTheme}". JSON: { "name": string, "prompt": string, "words": [string, string, string] }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]);
      setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTheme('');
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
           <div onClick={async () => playRawPcm(await generateTTS(`This is ${current.name}! Let's learn some ${current.name} words.`) || '')} className="relative w-full aspect-square bg-rose-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
              {loading ? <div className="w-16 h-16 border-8 border-rose-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-105" />}
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
      playRawPcm(await generateTTS(`Yes! The missing letter is ${opt}! You spelled ${current.word}!`) || '');
    } else {
      playRawPcm(await generateTTS(`Try again! That sound is different.`) || '');
    }
  };

  const generateWithAi = async () => {
    if (!aiWord) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Create a nursery "missing letter" challenge for word "${aiWord}". Pick one letter to be missing. JSON: { "word": string, "missing": string, "options": [string, string, string], "prompt": string }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]);
      setIsTeacherDrawerOpen(false); setIndex(data.length); setAiWord('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Challenge</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-emerald-600 mb-8 uppercase tracking-tighter">Complete the Word! 🧩</h3>
        <div className="flex gap-4 mb-12">
          {current.word.split('').map((char, i) => (
            <div key={i} className={`w-20 h-28 md:w-28 md:h-40 rounded-3xl flex items-center justify-center border-8 transition-all text-6xl font-black ${char === current.missing ? (answered ? 'bg-emerald-500 text-white border-white scale-110 shadow-xl' : 'bg-emerald-50 border-emerald-100 text-emerald-200 border-dashed') : 'bg-white border-emerald-50 text-emerald-600 shadow-md'}`}>
              {char === current.missing ? (answered ? char : '?') : char}
            </div>
          ))}
        </div>
        <div className="w-64 h-64 bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner mb-10 overflow-hidden">
           {loading ? <div className="absolute inset-0 flex items-center justify-center"><i className="fas fa-magic text-emerald-300 text-4xl"></i></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" />}
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
  const playSound = async () => { await playRawPcm(await generateTTS(`Let's learn the sound... ${current.blend.toUpperCase()}! ${current.blend} is for ${currentWord.word}.`) || ''); };

  const generateWithAi = async () => {
    if (!aiBlend) return; setIsAiLoading(true);
    try {
       // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Create a nursery phonics example for blend/digraph "${aiBlend}". JSON: { "blend": string, "type": "digraph"|"blend-l"|"blend-r"|"blend-s", "words": [{ "word": string, "prompt": string }, { "word": string, "prompt": string }] }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]);
      setIsTeacherDrawerOpen(false); setIndex(data.length); setWordIndex(0); setAiBlend('');
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
        <div onClick={playSound} className="relative w-80 h-80 bg-orange-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-orange-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 drop-shadow-xl transition-transform group-hover:scale-105" />}
          <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 drop-shadow-lg"></i></div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setWordIndex(i => (i === 0 ? current.words.length - 1 : i - 1))} className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200 shadow-md active:scale-90"><i className="fas fa-chevron-left fa-xl"></i></button>
          <button onClick={playSound} className="px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl">LISTEN SOUND</button>
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
  const playSound = async () => { await playRawPcm(await generateTTS(`${currentWord.word} rhymes with ${current.words.find(w => w.word !== currentWord.word)?.word || 'it'}. They both end with ${current.ending}!`) || ''); };

  const generateWithAi = async () => {
    if (!aiEnding) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Generate 3 nursery rhyming words ending in "${aiEnding}". JSON: { "ending": "${aiEnding}", "words": [{ "word": string, "prompt": string }, { "word": string, "prompt": string }, { "word": string, "prompt": string }] }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]);
      setIsTeacherDrawerOpen(false); setIndex(data.length); setWordIndex(0); setAiEnding('');
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
              <div onClick={playSound} className="relative w-64 h-64 bg-cyan-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-6 overflow-hidden cursor-pointer group">
                {loading ? <div className="w-12 h-12 border-8 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 drop-shadow-xl transition-transform group-hover:scale-105" />}
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
              <button onClick={playSound} className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest">CHECK RHYME</button>
           </div>
        </div>
        <div className="flex gap-4 mt-12"><button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-left fa-xl"></i></button><button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-right fa-xl"></i></button></div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-cyan-50"><h3 className="text-3xl font-black text-cyan-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Rhyme Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Rhyme Ending (e.g. -at, -en, -og)</label><input type="text" value={aiEnding} onChange={(e) => setAiEnding(e.target.value)} placeholder="e.g. -AT" className="w-full px-6 py-4 rounded-2xl border-2 border-cyan-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiEnding} className="w-full py-5 rounded-2xl font-black text-white bg-cyan-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE RHYMES'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- ALPHABET MODULE --- */
const AlphabetModule: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const currentItem = PHONICS_DATA[currentIndex];
  useEffect(() => { fetchImage(); }, [currentIndex]);
  const fetchImage = async () => { setLoading(true); const url = await generateLessonImage(currentItem.imagePrompt); setImageUrl(url); setLoading(false); };
  const playSound = async () => { setPlaying(true); const base64 = await generateTTS(`Big ${currentItem.upper}, little ${currentItem.lower}. ${currentItem.upper} is for ${currentItem.word}.`); if (base64) await playRawPcm(base64); setPlaying(false); };
  return (
    <div className="max-w-2xl mx-auto p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center relative overflow-hidden">
      <div className="flex gap-8 items-end mb-12"><div className="text-center"><p className="text-xs font-black text-pink-300 uppercase mb-2">Upper</p><h2 className="text-9xl font-black text-pink-500 drop-shadow-lg">{currentItem.upper}</h2></div><div className="text-center"><p className="text-xs font-black text-pink-300 uppercase mb-2">Lower</p><h2 className="text-7xl font-black text-pink-400 drop-shadow-md">{currentItem.lower}</h2></div></div>
      <div className="w-72 h-72 bg-pink-50 rounded-[3rem] overflow-hidden shadow-inner flex items-center justify-center relative mb-12 border-4 border-white group cursor-pointer" onClick={playSound}>{loading ? <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} alt={currentItem.word} className="w-full h-full object-cover p-6 group-hover:scale-110 transition-transform duration-500" />}</div>
      <div className="flex gap-6 items-center"><button onClick={() => setCurrentIndex(p => (p === 0 ? PHONICS_DATA.length - 1 : p - 1))} className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 shadow-md active:scale-90"><i className="fas fa-chevron-left text-2xl"></i></button><button onClick={playSound} disabled={playing} className={`w-24 h-24 rounded-full ${playing ? 'bg-pink-300' : 'bg-pink-500'} text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-all animate-bounce`}><i className={`fas ${playing ? 'fa-spinner fa-spin' : 'fa-volume-high'} text-4xl`}></i></button><button onClick={() => setCurrentIndex(p => (p + 1) % PHONICS_DATA.length)} className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 shadow-md active:scale-90"><i className="fas fa-chevron-right text-2xl"></i></button></div>
    </div>
  );
};

/* --- WORD FACTORY --- */
const WordFactoryModule: React.FC = () => {
  const [wordLength, setWordLength] = useState(3);
  const [words, setWords] = useState(INITIAL_WORDS);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const filteredWords = words.filter(w => w.word.length === wordLength);
  const current = filteredWords[index] || { word: '?', sentence: 'Add a word!', imagePrompt: '' };
  useEffect(() => { fetchImage(); }, [index, wordLength, words]);
  const fetchImage = async () => { if (!current.imagePrompt) return; setLoading(true); const url = await generateLessonImage(current.imagePrompt); setImageUrl(url); setLoading(false); };
  const playWord = async () => { if (current.word === '?') return; setPlaying(true); const spelling = current.word.split('').join('... '); if (spelling) await playRawPcm(await generateTTS(`Let's read! ${spelling}... ${current.word}. ${current.sentence}`) || ''); setPlaying(false); };
  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Generate a Nursery word. Theme: "${aiTheme}", Length: ${wordLength}. JSON: { "word": string, "sentence": string, "imagePrompt": string }`);
      const response = await result.response;
      const data = JSON.parse(response.text()); setWords(prev => [...prev, { ...data, word: data.word.toLowerCase() }]); setIsTeacherDrawerOpen(false); setIndex(words.filter(w => w.word.length === wordLength).length); setAiTheme('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-400 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Add Word</button>
      <div className="flex gap-2 mb-8 bg-white p-2 rounded-3xl shadow-xl border-4 border-orange-50 overflow-x-auto max-w-full no-scrollbar">{[2, 3, 4, 5, 6, 7, 8].map(len => (<button key={len} onClick={() => { setWordLength(len); setIndex(0); }} className={`px-5 py-3 rounded-2xl font-black transition-all min-w-[60px] ${wordLength === len ? 'bg-orange-500 text-white shadow-lg' : 'text-orange-300 hover:bg-orange-50'}`}>{len} <span className="text-[8px] block opacity-60">LETTERS</span></button>))}</div>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center">
        {filteredWords.length === 0 ? <div className="py-20 text-center text-orange-300 font-black uppercase tracking-widest">No {wordLength}-letter words yet!</div> : (
          <><div className="flex flex-wrap gap-2 mb-10 justify-center">{current.word.split('').map((char, i) => (<div key={i} className="w-16 h-20 md:w-24 md:h-32 bg-orange-50 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><span className="text-5xl md:text-7xl font-black text-orange-500 uppercase">{char}</span></div>))}</div>
            <div onClick={playWord} className="relative w-full aspect-video bg-gray-50 rounded-[3rem] border-4 border-white shadow-inner mb-10 overflow-hidden cursor-pointer group">{loading ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />}<div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors flex items-center justify-center"><i className={`fas ${playing ? 'fa-waveform animate-pulse text-white' : 'fa-play text-white opacity-0 group-hover:opacity-100'} text-6xl`}></i></div></div>
            <div className="text-center p-6 bg-orange-50 rounded-3xl border-4 border-dashed border-orange-200 mb-10 w-full font-bold text-orange-600 italic">"{current.sentence}"</div>
            <div className="flex gap-8"><button onClick={() => setIndex(p => (p === 0 ? filteredWords.length - 1 : p - 1))} className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 shadow-md active:scale-90"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={playWord} disabled={playing} className="px-10 py-4 bg-orange-500 text-white font-black rounded-full shadow-lg border-4 border-white uppercase text-xs tracking-widest"><i className="fas fa-volume-high"></i> READ WORD</button><button onClick={() => setIndex(p => (p + 1) % filteredWords.length)} className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 shadow-md active:scale-90"><i className="fas fa-arrow-right text-2xl"></i></button></div></>
        )}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-orange-50"><h3 className="text-3xl font-black text-orange-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> Word Maker</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. Zoo Animals" className="w-full px-6 py-4 rounded-2xl border-2 border-orange-100 focus:border-orange-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-orange-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE MAGIC WORD'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- WORD BUILDING MODULE --- */
const WordBuildingModule: React.FC = () => {
  const [items, setItems] = useState(INITIAL_WORDS.map(w => ({ ...w, shuffled: w.word.split('').sort(() => Math.random() - 0.5) })));
  const [index, setIndex] = useState(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');

  const current = items[index];

  useEffect(() => { fetchImage(); setUserWords([]); setIsCorrect(false); }, [index, items]);

  const fetchImage = async () => { setLoading(true); const url = await generateLessonImage(current.imagePrompt); setImageUrl(url); setLoading(false); };

  const handleLetterClick = (letter: string, i: number) => {
    if (isCorrect) return;
    const newLetters = [...userWords, letter];
    setUserWords(newLetters);
    if (newLetters.join('').toLowerCase() === current.word.toLowerCase()) {
      setIsCorrect(true);
      generateTTS(`Yes! You built the word ${current.word}!`).then(playRawPcm);
    } else if (newLetters.length === current.word.length) {
      generateTTS(`Not quite. Let's try building ${current.word} again!`).then(playRawPcm);
      setTimeout(() => setUserWords([]), 1000);
    }
  };

  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    try {
       // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Generate a Nursery word for word building. Theme: "${aiTheme}". JSON: { "word": string, "sentence": string, "imagePrompt": string }`);
      const response = await result.response;
      const data = JSON.parse(response.text());
      setItems(prev => [...prev, { ...data, shuffled: data.word.split('').sort(() => Math.random() - 0.5) }]);
      setIsTeacherDrawerOpen(false); setIndex(items.length); setAiTheme('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-yellow-200 text-yellow-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-tools mr-2"></i> New Build</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 flex flex-col items-center animate-in zoom-in duration-500 min-h-[600px]">
        <h3 className="text-3xl font-black text-yellow-600 mb-8 uppercase tracking-tighter text-center">Word Builder 🏗️</h3>
        <div className="w-64 h-64 bg-yellow-50 rounded-[3rem] border-8 border-white shadow-inner mb-10 overflow-hidden">
          {loading ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-4" />}
        </div>
        <div className="flex gap-2 mb-12 min-h-[100px] flex-wrap justify-center">
          {Array.from({ length: current.word.length }).map((_, i) => (
            <div key={i} className={`w-16 h-20 rounded-2xl flex items-center justify-center border-4 border-dashed text-4xl font-black transition-all ${userWords[i] ? 'bg-yellow-500 text-white border-white scale-110 shadow-lg' : 'bg-yellow-50 border-yellow-200 text-yellow-200'}`}>
              {userWords[i] || ''}
            </div>
          ))}
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          {!isCorrect && current.shuffled.map((l, i) => !userWords.includes(l) && <button key={i} onClick={() => handleLetterClick(l, i)} className="w-16 h-16 bg-white border-4 border-yellow-100 rounded-2xl text-3xl font-black text-yellow-500 shadow-md hover:scale-110 active:scale-95 transition-all uppercase">{l}</button>)}
        </div>
        {isCorrect && <button onClick={() => setIndex(i => (i + 1) % items.length)} className="mt-8 px-12 py-4 bg-yellow-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase tracking-widest">NEXT BUILD <i className="fas fa-arrow-right"></i></button>}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-yellow-100"><h3 className="text-3xl font-black text-yellow-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Builder Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. Fruits" className="w-full px-6 py-4 rounded-2xl border-2 border-yellow-100 focus:border-yellow-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-yellow-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC BUILD'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- GRAMMAR MODULE --- */
const GrammarModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'nouns' | 'verbs' | 'plurals' | 'articles' | 'pronouns' | 'determiners' | 'prepositions'>('verbs');
  const [data, setData] = useState(GRAMMAR_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');

  const currentItems = data[subTab] || [];
  const current: any = currentItems[index] || {};

  useEffect(() => { fetchVisual(); }, [subTab, index, data]);

  const fetchVisual = async () => { 
    if (!current.prompt) return;
    setLoading(true); 
    const url = await generateLessonImage(current.prompt); 
    setImageUrl(url); 
    setLoading(false); 
  };

  const speakGrammar = () => {
    let msg = "";
    if (subTab === 'nouns') msg = `${current.word} is a noun! It is a ${current.type}.`;
    else if (subTab === 'verbs') msg = `${current.word} is an action word! See them ${current.action.toLowerCase()}!`;
    else if (subTab === 'plurals') msg = `Look! One ${current.singular}, but many ${current.plural}! This is how we say many!`;
    else if (subTab === 'articles') msg = `We say ${current.article} ${current.word}.`;
    else if (subTab === 'pronouns') msg = `We use the pronoun ${current.subject}. ${current.example}`;
    else if (subTab === 'determiners' || subTab === 'prepositions') msg = `Where is it? ${current.example}`;
    generateTTS(msg).then(playRawPcm);
  };

  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    try {
       // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const prompt = `Create a Nursery 1 simplified ${subTab} grammar example for theme "${aiTheme}". 
        JSON structure matching exactly: 
        - if nouns: { "word": string, "type": "Person"|"Place"|"Thing"|"Animal", "prompt": string }
        - if verbs: { "word": string, "action": string, "prompt": string }
        - if plurals: { "singular": string, "plural": string, "prompt": string }
        - if articles: { "word": string, "article": "a"|"an", "prompt": string }
        - if pronouns: { "subject": "He"|"She"|"His"|"Her", "example": string, "prompt": string }
        - if determiners: { "word": "This"|"That", "example": string, "prompt": string }
        - if prepositions: { "word": "In"|"On"|"Under"|"In front of", "example": string, "prompt": string }`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const res = JSON.parse(response.text());
      setData((prev: any) => ({ ...prev, [subTab]: [...prev[subTab], res] }));
      setIsTeacherDrawerOpen(false); setIndex(data[subTab].length); setAiTheme('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest z-10"><i className="fas fa-plus mr-2"></i> AI Grammar</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <div className="flex gap-2 mb-10 p-2 bg-indigo-50 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
          {(['nouns', 'verbs', 'plurals', 'articles', 'pronouns', 'determiners', 'prepositions'] as const).map(t => (<button key={t} onClick={() => { setSubTab(t); setIndex(0); }} className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all flex-shrink-0 ${subTab === t ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-100'}`}>{t === 'verbs' ? 'Action Words' : t === 'plurals' ? 'One and Many' : t}</button>))}
        </div>
        <div className="text-center mb-10">
          <h3 className="text-5xl font-black text-indigo-600 mb-2 uppercase tracking-tighter">
            {subTab === 'plurals' ? `${current.singular} → ${current.plural}` : 
             subTab === 'articles' ? `${current.article} ${current.word}` : 
             subTab === 'pronouns' ? current.subject :
             subTab === 'determiners' || subTab === 'prepositions' ? current.word :
             current.word}
          </h3>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            {current.example || (subTab === 'nouns' ? `It is a ${current.type}!` : subTab === 'verbs' ? current.action : '')}
          </p>
        </div>
        <div onClick={speakGrammar} className="relative w-80 h-80 md:w-96 md:h-96 bg-indigo-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 cursor-pointer group overflow-hidden">
          {loading ? <div className="w-16 h-16 border-8 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 drop-shadow-xl transition-transform group-hover:scale-105" />}
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 drop-shadow-lg"></i></div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setIndex(i => (i === 0 ? currentItems.length - 1 : i - 1))} className="w-14 h-14 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-200 shadow-md active:scale-90"><i className="fas fa-chevron-left fa-xl"></i></button>
          <button onClick={speakGrammar} className="px-10 py-4 bg-indigo-500 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest">Listen!</button>
          <button onClick={() => setIndex(i => (i + 1) % currentItems.length)} className="w-14 h-14 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-200 shadow-md active:scale-90"><i className="fas fa-chevron-right fa-xl"></i></button>
        </div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-indigo-50"><h3 className="text-3xl font-black text-indigo-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> Grammar Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme / Object</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. My Toy Bus" className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-indigo-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : `CREATE ${subTab.toUpperCase()}`}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- READING MODULE --- */
const ReadingModule: React.FC = () => {
  const [data, setData] = useState(READING_DATA);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<'story' | 'activity'>('story');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);

  const current = data[index];

  useEffect(() => { fetchVisual(); setMode('story'); setQuizIndex(0); }, [index, data]);

  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.imagePrompt); setImageUrl(url); setLoading(false); };

  const playReading = async () => { setPlaying(true); const base64 = await generateTTS(`Let's listen and read together! ${current.title}... ${current.text}`); if (base64) await playRawPcm(base64); setPlaying(false); };

  const handleQuizAnswer = (optIndex: number) => {
    const isCorrect = optIndex === current.activities[quizIndex].correct;
    if (isCorrect) {
      generateTTS("Yes! You are so smart! Perfect comprehension!").then(playRawPcm);
      if (quizIndex < current.activities.length - 1) setQuizIndex(q => q + 1);
      else { setMode('story'); generateTTS("Great job listening! You finished the story quiz!").then(playRawPcm); }
    } else { generateTTS("Look back at the picture! Try again!").then(playRawPcm); }
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Generate a Nursery Listening Comprehension story and 2 quiz questions. Topic: "${aiTopic}". JSON: { "title": string, "text": string, "imagePrompt": string, "activities": [ { "question": string, "options": [string, string, string], "correct": number } ] }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]); setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTopic('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Add Story</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center animate-in slide-in-from-bottom duration-700 min-h-[600px]">
        {mode === 'story' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative w-full aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner overflow-hidden cursor-pointer group" onClick={playReading}>
              {loading ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-105" />}
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-all"><i className={`fas ${playing ? 'fa-waveform animate-pulse text-white' : 'fa-play text-white opacity-0 group-hover:opacity-100'} text-6xl`}></i></div>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-4xl font-black text-emerald-600 leading-none">{current.title}</h4>
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-4 border-dashed border-emerald-200"><p className="text-2xl font-bold text-emerald-800 leading-relaxed italic">"{current.text}"</p></div>
              <div className="flex flex-col gap-2">
                 <button onClick={playReading} disabled={playing} className="w-full py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest"><i className="fas fa-volume-high"></i> Listen</button>
                 <button onClick={() => setMode('activity')} className="w-full py-4 bg-emerald-100 text-emerald-600 font-black rounded-2xl hover:bg-emerald-200 uppercase tracking-widest text-xs">Start Quiz!</button>
              </div>
              <div className="flex gap-4 justify-center"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><i className="fas fa-arrow-left"></i></button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><i className="fas fa-arrow-right"></i></button></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in zoom-in">
             <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl"><i className="fas fa-star text-5xl text-emerald-500 animate-pulse"></i></div>
             <h4 className="text-3xl font-black text-emerald-600 mb-8 text-center">{current.activities[quizIndex].question}</h4>
             <div className="grid grid-cols-1 gap-4 w-full max-w-lg">
                {current.activities[quizIndex].options.map((opt, i) => (
                  <button key={i} onClick={() => handleQuizAnswer(i)} className="py-6 px-10 bg-white border-4 border-emerald-50 rounded-3xl text-2xl font-bold text-emerald-800 shadow-lg hover:bg-emerald-50 transition-all">{opt}</button>
                ))}
             </div>
             <button onClick={() => setMode('story')} className="mt-12 text-emerald-400 font-bold uppercase text-xs tracking-widest underline">Back to Story</button>
          </div>
        )}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Story Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Story Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. A Little Ant" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC STORY'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- SENTENCES MODULE --- */
const SentencesModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'patterns' | 'formation'>('patterns');
  const [data, setData] = useState(SENTENCE_DATA.map(s => ({ ...s, shuffled: s.text.replace('.', '').split(' ').sort(() => Math.random() - 0.5) })));
  const [index, setIndex] = useState(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');

  const current = data[index];

  useEffect(() => { fetchVisual(); setUserWords([]); }, [index, subTab, data]);

  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.imagePrompt); setImageUrl(url); setLoading(false); };

  const handleWordClick = (word: string) => {
    const newWords = [...userWords, word];
    setUserWords(newWords);
    if (newWords.join(' ').toLowerCase() === current.text.replace('.', '').toLowerCase()) {
      generateTTS(`Yes! You built the sentence: ${current.text}`).then(playRawPcm);
    } else if (newWords.length === current.shuffled.length) {
      generateTTS("Almost! Let's try to fix the order!").then(playRawPcm);
      setTimeout(() => setUserWords([]), 1000);
    }
  };

  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    try {
       // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Nursery sentence and pattern. Theme: "${aiTheme}". JSON: { "text": string, "pattern": string, "imagePrompt": string }`);
      const response = await result.response;
      const res = JSON.parse(response.text());
      setData(prev => [...prev, { ...res, shuffled: res.text.replace('.', '').split(' ').sort(() => Math.random() - 0.5) }]);
      setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTheme('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-cyan-200 text-cyan-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Add Sentence</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <div className="flex gap-4 mb-10 p-2 bg-cyan-50 rounded-2xl">{(['patterns', 'formation'] as const).map(t => (<button key={t} onClick={() => setSubTab(t)} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${subTab === t ? 'bg-cyan-500 text-white shadow-md' : 'text-cyan-300 hover:bg-cyan-100'}`}>{t}</button>))}</div>
        <div className="relative w-80 h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden mb-10 bg-cyan-50">
           {loading ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10 group-hover:scale-110 transition-all" />}
        </div>
        {subTab === 'patterns' ? (
          <div className="text-center bg-cyan-50 p-8 rounded-[3rem] border-4 border-dashed border-cyan-200 mb-10 w-full max-w-2xl animate-in fade-in">
            <p className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-2">Pattern: {current.pattern}</p>
            <p className="text-4xl font-black text-cyan-600 tracking-tight">"{current.text}"</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom">
             <div className="flex flex-wrap gap-3 mb-10 justify-center min-h-[60px]">
                {userWords.map((w, i) => <div key={i} className="px-6 py-3 bg-cyan-500 text-white rounded-2xl font-black text-xl shadow-lg border-2 border-white animate-in zoom-in">{w}</div>)}
             </div>
             <div className="flex flex-wrap gap-4 justify-center">
                {current.shuffled.map((w, i) => !userWords.includes(w) && <button key={i} onClick={() => handleWordClick(w)} className="px-8 py-4 bg-white border-4 border-cyan-50 rounded-3xl text-2xl font-bold text-cyan-500 shadow-md hover:scale-105 transition-all">{w}</button>)}
             </div>
          </div>
        )}
        <div className="flex gap-4 mt-8"><button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-left"></i></button><button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-right"></i></button></div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-cyan-50"><h3 className="text-3xl font-black text-cyan-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Pattern Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Subject</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. My Toy Bus" className="w-full px-6 py-4 rounded-2xl border-2 border-cyan-100 focus:border-cyan-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-cyan-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC SENTENCE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- HIDDEN WORDS MODULE --- */
const HiddenWordsModule: React.FC = () => {
  const [data, setData] = useState(HIDDEN_WORDS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiBaseWord, setAiBaseWord] = useState('');
  const current = data[index];
  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.imagePrompt); setImageUrl(url); setLoading(false); };
  const handleGuess = (word: string) => {
    if (word === current.target) {
      setScore(s => s + 1); setShowSuccess(true); generateTTS(`Yes! You found ${word}!`).then(playRawPcm);
      setTimeout(() => { setShowSuccess(false); setIndex(p => (p + 1) % data.length); }, 3000);
    } else { generateTTS(`Oops! That's ${word}. Try again!`).then(playRawPcm); }
  };
  const generateWithAi = async () => {
    if (!aiBaseWord) return; setIsAiLoading(true);
    try {
       // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Find word game for "${aiBaseWord}". JSON: { "target": string, "options": [string, string, string, string], "imagePrompt": string }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]); setIsTeacherDrawerOpen(false); setIndex(data.length); setAiBaseWord('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-rose-200 text-rose-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Add Game</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-rose-100 flex flex-col items-center animate-in fade-in duration-700 min-h-[600px] relative overflow-hidden">
        <div className="absolute top-8 left-8 flex items-center gap-2 bg-rose-50 px-6 py-2 rounded-full border-2 border-rose-100"><i className="fas fa-trophy text-yellow-400"></i><span className="font-black text-rose-500">SCORE: {score}</span></div>
        <h3 className="text-3xl font-black text-rose-500 mb-8 uppercase tracking-tighter">Magic Word Hunt 🔍</h3>
        <div className="text-center mb-8"><p className="text-2xl text-gray-400 font-bold">Find the word:</p><h2 className="text-7xl font-black text-rose-500 drop-shadow-lg tracking-widest">{current.target}</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center">
          <div className="w-full aspect-square bg-rose-50 rounded-[3rem] border-8 border-white shadow-inner overflow-hidden relative">{loading ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-8 animate-in zoom-in duration-1000" />}</div>
          <div className="grid grid-cols-2 gap-4">{current.options.map((opt, i) => (<button key={i} onClick={() => handleGuess(opt)} className="p-8 bg-white border-4 border-rose-50 rounded-3xl text-3xl font-black text-rose-400 shadow-lg hover:scale-105 active:scale-95 transition-all hover:border-rose-300 hover:text-rose-500 uppercase">{opt}</button>))}</div>
        </div>
      </div>
      {showSuccess && <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[200] animate-in zoom-in duration-300"><div className="bg-white/95 backdrop-blur-md p-20 rounded-[5rem] shadow-2xl border-[16px] border-yellow-400 flex flex-col items-center"><i className="fas fa-wand-magic-sparkles text-[12rem] text-yellow-400 animate-bounce mb-8"></i><h2 className="text-7xl font-black text-rose-500 tracking-tighter">FOUND IT!</h2></div></div>}
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-rose-50"><h3 className="text-3xl font-black text-rose-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Game Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Word to Find</label><input type="text" value={aiBaseWord} onChange={(e) => setAiBaseWord(e.target.value)} placeholder="e.g. STAR" className="w-full px-6 py-4 rounded-2xl border-2 border-rose-100 focus:border-rose-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiBaseWord} className="w-full py-5 rounded-2xl font-black text-white bg-rose-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC GAME'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- OPPOSITES MODULE --- */
const OppositesModule: React.FC = () => {
  const [data, setData] = useState(OPPOSITES_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const current = data[index];
  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.imagePrompt); setImageUrl(url); setLoading(false); };
  const playOpposite = async () => { await playRawPcm(await generateTTS(`Look at this! ${current.word}... and the opposite is... ${current.opposite}!`) || ''); };
  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Nursery opposites for topic "${aiTopic}". JSON: { "word": string, "opposite": string, "imagePrompt": string }`);
      const response = await result.response;
      setData(prev => [...prev, JSON.parse(response.text())]); setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTopic('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Add Opposite</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <h3 className="text-3xl font-black text-purple-600 mb-8 uppercase tracking-tighter text-center">Words and Opposites ↔️</h3>
        <div className="grid grid-cols-2 gap-8 w-full mb-10">
          <div className="p-8 bg-purple-50 rounded-3xl border-4 border-white shadow-lg text-center animate-in slide-in-from-left"><h4 className="text-4xl font-black text-purple-600 uppercase">{current.word}</h4></div>
          <div className="p-8 bg-purple-50 rounded-3xl border-4 border-white shadow-lg text-center animate-in slide-in-from-right"><h4 className="text-4xl font-black text-purple-600 uppercase">{current.opposite}</h4></div>
        </div>
        <div onClick={playOpposite} className="relative w-full max-w-2xl aspect-video bg-gray-50 rounded-[3rem] border-8 border-white shadow-inner mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
          <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white text-6xl opacity-0 group-hover:opacity-100"></i></div>
        </div>
        <div className="flex gap-4"><button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-14 h-14 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center hover:bg-purple-200"><i className="fas fa-arrow-left"></i></button><button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-14 h-14 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center hover:bg-purple-200"><i className="fas fa-arrow-right"></i></button></div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-purple-50"><h3 className="text-3xl font-black text-purple-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> Opposite Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Opposite Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Fast/Slow" className="w-full px-6 py-4 rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-purple-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC OPPOSITE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- DICTION HUB --- */
const DictionModule: React.FC = () => {
  const [data, setData] = useState(DICTION_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiWord, setAiWord] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const current = data[index];
  useEffect(() => { fetchImage(); }, [index, data]);
  const fetchImage = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const playDiction = async () => { setPlaying(true); const text = `Listen closely. Let's say ${current.word}. ${current.syllables}. ${current.instruction}`; const base64 = await generateTTS(text, 'Charon'); if (base64) await playRawPcm(base64); setPlaying(false); };
  const generateDictionWithAi = async () => {
    if (!aiWord) return; setIsAiLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const result = await model.generateContent(`Break down word "${aiWord}" for diction. JSON: { "word": string, "syllables": string, "instruction": string, "prompt": string }`);
      const response = await result.response;
      setData(prev => [...prev, { ...JSON.parse(response.text()), word: aiWord.toUpperCase() }]); setAiWord(''); setIsDrawerOpen(false); setIndex(data.length);
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center relative animate-in slide-in-from-bottom duration-700">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-400 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Add Diction</button>
      <h3 className="text-3xl font-black text-blue-500 mb-8 uppercase tracking-tight text-center">Diction Hub 🗣️</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full h-80 bg-blue-50 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl flex items-center justify-center relative group" onClick={playDiction}>
             {loading ? <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform duration-1000 group-hover:scale-110" />}
             <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center"><i className={`fas ${playing ? 'fa-waveform animate-pulse text-white' : 'fa-mouth text-white opacity-0 group-hover:opacity-100'} text-6xl`}></i></div>
          </div>
          <div className="flex gap-4"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 shadow-md active:scale-90"><i className="fas fa-chevron-left text-xl"></i></button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 shadow-md active:scale-90"><i className="fas fa-chevron-right text-xl"></i></button></div>
        </div>
        <div className="space-y-8 text-center md:text-left">
          <h4 className="text-5xl font-black text-blue-600 mb-2">{current.word}</h4>
          <div className="flex justify-center md:justify-start gap-4 flex-wrap">{current.syllables.split('-').map((s, i) => (<span key={i} className="px-6 py-2 bg-blue-500 text-white rounded-2xl font-black text-2xl shadow-lg border-4 border-white animate-bounce" style={{animationDelay: `${i*0.3}s`}}>{s}</span>))}</div>
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border-4 border-dashed border-blue-200 text-xl font-bold text-blue-800 leading-relaxed italic">"{current.instruction}"</div>
          <button onClick={playDiction} disabled={playing} className="w-full py-6 rounded-3xl font-black text-2xl text-white bg-blue-600 shadow-xl border-4 border-white"><i className="fas fa-volume-high"></i> LISTEN & REPEAT</button>
        </div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-100"><h3 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Diction Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Word</label><input type="text" value={aiWord} onChange={(e) => setAiWord(e.target.value)} placeholder="e.g. Butterfly" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateDictionWithAi} disabled={isAiLoading || !aiWord} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE DICTION'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- MAGIC PEN MODULE --- */
const WritingModule: React.FC = () => {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'letters' | 'strokes' | 'numbers'>('letters');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedNumber, setSelectedNumber] = useState('1');
  const [selectedStroke, setSelectedStroke] = useState('standing');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isDrawingRef = useRef(false);
  useEffect(() => { setupCanvas(traceCanvasRef.current, true); setupCanvas(freeCanvasRef.current, false); }, [selectedLetter, selectedNumber, selectedStroke, mode]);
  const setupCanvas = (canvas: HTMLCanvasElement | null, isTrace: boolean) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = 400; canvas.height = 400;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2; const midX = canvas.width / 2;
    ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, midY - 120); ctx.lineTo(canvas.width, midY - 120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, midY + 120); ctx.lineTo(canvas.width, midY + 120); ctx.stroke();
    ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(canvas.width, midY); ctx.stroke(); ctx.setLineDash([]);
    if (isTrace) {
      ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]);
      if (mode === 'letters' || mode === 'numbers') {
        ctx.font = `900 ${mode === 'numbers' && selectedNumber === '10' ? 280 : 350}px Fredoka`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.strokeText(mode === 'letters' ? selectedLetter : selectedNumber, midX, midY + 20);
      } else {
        ctx.beginPath(); const p = 100;
        if (selectedStroke === 'standing') { ctx.moveTo(midX, midY - p); ctx.lineTo(midX, midY + p); }
        else if (selectedStroke === 'sleeping') { ctx.moveTo(midX - p, midY); ctx.lineTo(midX + p, midY); }
        else if (selectedStroke === 'slanting') { ctx.moveTo(midX - p, midY - p); ctx.lineTo(midX + p, midY + p); }
        else if (selectedStroke === 'circle') { ctx.arc(midX, midY, p, 0, Math.PI * 2); }
        ctx.stroke();
      }
    }
  };
  const getPointerPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
  };
  const startDrawing = (e: any, ref: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    if (e.type.startsWith('touch')) e.preventDefault();
    isDrawingRef.current = true; const pos = getPointerPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#FF6B6B';
  };
  const draw = (e: any, ref: React.RefObject<HTMLCanvasElement | null>) => {
    if (!isDrawingRef.current) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    if (e.type.startsWith('touch')) e.preventDefault();
    const pos = getPointerPos(e, canvas); ctx.lineTo(pos.x, pos.y); ctx.stroke();
  };
  const stopDrawing = () => { isDrawingRef.current = false; };
  const handleFinish = async () => {
    if (!freeCanvasRef.current) return;
    setIsEvaluating(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
      const dataUrl = freeCanvasRef.current.toDataURL('image/png').split(',')[1];
      const target = mode === 'letters' ? selectedLetter : mode === 'numbers' ? selectedNumber : selectedStroke;
      const result = await model.generateContent({ parts: [{ text: `Is this a recognizable ${target}? Respond YES or NO.` }, { inlineData: { mimeType: 'image/png', data: dataUrl } }] });
      const response = await result.response;
      if (response.text()?.toUpperCase().includes('YES')) { setShowSuccess(true); generateTTS(`Great job!`).then(playRawPcm); setTimeout(() => setShowSuccess(false), 3000); } else { generateTTS(`Try again!`).then(playRawPcm); }
    } catch (e) { console.error(e); } finally { setIsEvaluating(false); }
  };
  return (
    <div className="flex flex-col items-center gap-6 relative">
      <div className="flex bg-white p-2 rounded-2xl shadow-xl gap-2 flex-wrap justify-center">{(['letters', 'numbers', 'strokes'] as const).map(m => (<button key={m} onClick={() => setMode(m)} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${mode === m ? 'bg-green-500 text-white shadow-md' : 'text-green-300 hover:bg-green-50'}`}>{m}</button>))}</div>
      <div className="flex overflow-x-auto gap-2 max-w-full no-scrollbar pb-2">
        {mode === 'letters' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => <button key={l} onClick={() => setSelectedLetter(l)} className={`flex-shrink-0 w-12 h-12 rounded-xl font-black border-2 transition-all ${selectedLetter === l ? 'bg-pink-500 text-white scale-110' : 'bg-white text-pink-300'}`}>{l}</button>) :
         mode === 'numbers' ? "12345678910".split("").map(n => <button key={n} onClick={() => setSelectedNumber(n)} className={`flex-shrink-0 w-12 h-12 rounded-xl font-black border-2 transition-all ${selectedNumber === n ? 'bg-orange-500 text-white scale-110' : 'bg-white text-orange-400'}`}>{n}</button>) :
         ['standing', 'sleeping', 'slanting', 'circle'].map(s => <button key={s} onClick={() => setSelectedStroke(s)} className={`flex-shrink-0 px-4 h-12 rounded-xl font-black border-2 transition-all ${selectedStroke === s ? 'bg-blue-500 text-white' : 'bg-white text-blue-300'}`}>{s}</button>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"><canvas ref={traceCanvasRef} onMouseDown={(e) => startDrawing(e, traceCanvasRef)} onMouseMove={(e) => draw(e, traceCanvasRef)} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={(e) => startDrawing(e, traceCanvasRef)} onTouchMove={(e) => draw(e, traceCanvasRef)} onTouchEnd={stopDrawing} className="bg-white border-8 border-pink-50 rounded-[3rem] shadow-xl w-full" /><canvas ref={freeCanvasRef} onMouseDown={(e) => startDrawing(e, freeCanvasRef)} onMouseMove={(e) => draw(e, freeCanvasRef)} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={(e) => startDrawing(e, freeCanvasRef)} onTouchMove={(e) => draw(e, freeCanvasRef)} onTouchEnd={stopDrawing} className="bg-white border-8 border-blue-50 rounded-[3rem] shadow-xl w-full" /></div>
      <button onClick={handleFinish} className="px-10 py-3 bg-green-500 text-white font-black rounded-2xl shadow-lg">{isEvaluating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>} Check Work</button>
      {showSuccess && <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"><h4 className="text-4xl font-black bg-white p-12 rounded-[3rem] shadow-2xl border-8 border-yellow-400">SUPER STAR!</h4></div>}
    </div>
  );
};

/* --- SONGS MODULE --- */
const SongsModule: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [rhyme, setRhyme] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleCreate = async (t?: string) => {
    const finalTopic = t || topic; if (!finalTopic) return;
    setLoading(true); setVideoUrl(null); setRhyme('');
    try { const generatedRhyme = await generateRhyme(finalTopic); setRhyme(generatedRhyme); const generatedVideoUrl = await generateSongVideo(finalTopic); setVideoUrl(generatedVideoUrl); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  return (
    <div className="w-full bg-yellow-50 p-10 rounded-[3.5rem] shadow-2xl border-8 border-yellow-100 flex flex-col items-center min-h-[600px]">
      <h2 className="text-4xl font-black text-yellow-600 mb-8 uppercase tracking-tighter">Song Box 🎶</h2>
      {!videoUrl && !loading ? (
        <div className="w-full max-w-xl space-y-8"><div className="grid grid-cols-2 gap-4">{['Happy Farm', 'Little Kittens', 'Magic Rocket', 'Blue Whale'].map(t => (<button key={t} onClick={() => handleCreate(t)} className="p-6 bg-white rounded-3xl border-4 border-yellow-200 text-yellow-600 font-black shadow-lg hover:scale-105 transition-all">{t}</button>))}</div><div className="flex gap-2"><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Type a topic..." className="flex-grow px-6 py-4 rounded-2xl border-4 border-yellow-100 font-bold" />
        <button onClick={() => handleCreate()} className="px-8 bg-yellow-500 text-white font-black rounded-2xl shadow-xl">GO!</button></div></div>
      ) : loading ? (<div className="flex flex-col items-center gap-6"><div className="w-20 h-20 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin"></div><p className="font-black text-yellow-700 animate-pulse uppercase tracking-widest">Making Magic Video...</p></div>) : (
        <div className="w-full max-w-3xl space-y-6 animate-in zoom-in"><video src={videoUrl!} controls autoPlay loop className="w-full rounded-[2.5rem] shadow-2xl border-8 border-white bg-black" /><div className="bg-white p-8 rounded-[2rem] border-4 border-yellow-100 text-center italic font-bold text-gray-700 whitespace-pre-line leading-relaxed shadow-lg">"{rhyme}"</div><button onClick={() => { setVideoUrl(null); setRhyme(''); }} className="px-10 py-4 bg-yellow-500 text-white font-black rounded-full shadow-lg self-center mx-auto block">NEW SONG</button></div>
      )}
    </div>
  );
};

export default LiteracyZone;

    