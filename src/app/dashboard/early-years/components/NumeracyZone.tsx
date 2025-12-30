
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NUMERACY_DATA, ADDITION_DATA, SUBTRACTION_DATA, NUMBER_WORDS_DATA, TIME_DATA, MEASUREMENT_DATA, TENS_UNITS_DATA, GROUPING_DATA, SEQUENCE_DATA, NUM_COMPARISON_DATA, COUNTING_TASK_DATA, NUMBER_BONDS_DATA, SPATIAL_DATA, MONEY_DATA } from '../constants';
import { generateLessonImage, generateTTS, generateNumeracyTask } from '../services/gemini';
import { playRawPcm } from '../services/audio';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

type MathTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one' | 'tracing';

const NumeracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MathTab>('numbers');
  const [playing, setPlaying] = useState(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const playFeedbackSound = async (text: string) => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
    }
    setPlaying(true);
    const base64 = await generateTTS(text, 'Kore');
    if (base64) {
      const source = await playRawPcm(base64);
      if (source) {
        currentSourceRef.current = source;
        source.onended = () => { setPlaying(false); currentSourceRef.current = null; };
      } else { setPlaying(false); }
    } else { setPlaying(false); }
  };

  const tabs: {id: MathTab, icon: string}[] = [
    { id: 'numbers', icon: 'fa-1' },
    { id: 'counting', icon: 'fa-list-ol' },
    { id: 'sequence', icon: 'fa-arrow-right-long' },
    { id: 'comparing', icon: 'fa-scale-unbalanced' },
    { id: 'number-words', icon: 'fa-font' },
    { id: 'bonds', icon: 'fa-handshake' },
    { id: 'addition', icon: 'fa-plus' },
    { id: 'subtraction', icon: 'fa-minus' },
    { id: 'tens-units', icon: 'fa-layer-group' },
    { id: 'grouping', icon: 'fa-object-group' },
    { id: 'time', icon: 'fa-clock' },
    { id: 'money', icon: 'fa-coins' },
    { id: 'measurement', icon: 'fa-ruler-vertical' },
    { id: 'shapes', icon: 'fa-shapes' },
    { id: 'spatial', icon: 'fa-arrows-up-down-left-right' },
    { id: 'comparison', icon: 'fa-scale-balanced' },
    { id: 'patterns', icon: 'fa-square-check' },
    { id: 'one-to-one', icon: 'fa-arrows-left-right' },
    { id: 'tracing', icon: 'fa-pen-clip' }
  ];

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-purple-50 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[110px] px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === tab.id ? 'bg-purple-500 text-white shadow-xl scale-110 -translate-y-1' : 'text-gray-300 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${tab.icon} text-lg`}></i>
              <span>{tab.id.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4">
        {activeTab === 'numbers' && <NumbersMainModule onSound={playFeedbackSound} />}
        {activeTab === 'counting' && <CountingGame onSound={playFeedbackSound} />}
        {activeTab === 'sequence' && <NumberSequenceModule onSound={playFeedbackSound} />}
        {activeTab === 'comparing' && <NumberComparisonModule onSound={playFeedbackSound} />}
        {activeTab === 'number-words' && <NumberWordsModule onSound={playFeedbackSound} />}
        {activeTab === 'bonds' && <NumberBondsModule onSound={playFeedbackSound} />}
        {activeTab === 'addition' && <AdditionModule onSound={playFeedbackSound} />}
        {activeTab === 'subtraction' && <SubtractionModule onSound={playFeedbackSound} />}
        {activeTab === 'tens-units' && <TensUnitsModule onSound={playFeedbackSound} />}
        {activeTab === 'grouping' && <GroupingModule onSound={playFeedbackSound} />}
        {activeTab === 'time' && <TellingTimeModule onSound={playFeedbackSound} />}
        {activeTab === 'money' && <MoneyCountingModule onSound={playFeedbackSound} />}
        {activeTab === 'measurement' && <MeasurementModule onSound={playFeedbackSound} />}
        {activeTab === 'shapes' && <ShapesModule onSound={playFeedbackSound} />}
        {activeTab === 'spatial' && <SpatialModule onSound={playFeedbackSound} />}
        {activeTab === 'comparison' && <ComparisonGame onSound={playFeedbackSound} />}
        {activeTab === 'patterns' && <PatternGame onSound={playFeedbackSound} />}
        {activeTab === 'one-to-one' && <OneToOneGame onSound={playFeedbackSound} />}
        {activeTab === 'tracing' && <NumberMagicPen />}
      </div>
    </div>
  );
};

/* --- SPATIAL REASONING (Position Words) --- */
const SpatialModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(SPATIAL_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [answered, setAnswered] = useState(false);

  const current = data[index];

  useEffect(() => { fetchVisual(); setAnswered(false); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };

  const handleChoice = (pos: string) => {
    if (pos === current.position) {
      setAnswered(true);
      onSound(`Yes! The ${current.target} is ${pos} the ${current.refObject}! Great eyes!`);
    } else {
      onSound(`Look closely! Is the ${current.target} really ${pos}?`);
    }
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ target: z.string(), position: z.enum(["above", "below", "beside"]), refObject: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({
        prompt: `Create a nursery "position words" task for object "${aiTopic}".`,
        output: { schema: resultSchema }
      });
      if(output){
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-sm z-10"><i className="fas fa-magic"></i> AI Spatial Assistant</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[550px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase tracking-tighter text-center">Where is it? 🕵️‍♀️</h3>
        <p className="text-2xl font-bold text-gray-400 mb-10 italic">Where is the <span className="text-blue-500">{current.target}</span>?</p>
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden group">
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" />}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
           {['above', 'below', 'beside'].map(pos => (
             <button key={pos} onClick={() => handleChoice(pos)} className={`px-8 py-4 rounded-2xl font-black text-xl transition-all border-4 ${answered && pos === current.position ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-blue-50 text-blue-500 border-white hover:bg-blue-100'}`}>{pos.toUpperCase()}</button>
           ))}
        </div>
        {answered && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Find Another! 🔍</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6">AI Position Maker</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Main Object (e.g. Teddy Bear)</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Red Ball" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE SCENE'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- MONEY (Coins Intro) --- */
const MoneyCountingModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(MONEY_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  const options = [current.amount, current.amount + 1, current.amount - 1].filter(o => o >= 1).sort(() => Math.random() - 0.5);

  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };

  const handleAnswer = (val: number) => {
    setUserAnswer(val);
    if (val === current.amount) onSound(`Yes! You counted ${val} shiny coins! You are rich in knowledge!`);
    else onSound(`Let's count them together. Point to each coin!`);
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ amount: z.number().min(1).max(10), coins: z.number(), label: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Create a nursery "counting money" task with ${aiTopic} theme.`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-yellow-200 text-yellow-600 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-sm z-10"><i className="fas fa-magic"></i> AI Money Assistant</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 flex flex-col items-center min-h-[550px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-yellow-600 mb-8 uppercase tracking-tighter text-center">Counting Money! 💰</h3>
        <p className="text-2xl font-bold text-gray-400 mb-10 italic">How many shiny coins can you see?</p>
        <div onClick={() => onSound("Let's count our pocket money!")} className="w-full max-w-2xl aspect-video bg-yellow-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
        </div>
        <div className="flex gap-6">
           {options.map(opt => (
             <button key={opt} onClick={() => handleAnswer(opt)} className={`w-24 h-24 rounded-3xl font-black text-4xl transition-all border-4 ${userAnswer === opt ? (opt === current.amount ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-yellow-50 text-yellow-600 border-white hover:bg-yellow-100'}`}>{opt}</button>
           ))}
        </div>
        {userAnswer === current.amount && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">More Coins! 🏦</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-yellow-50"><h3 className="text-3xl font-black text-yellow-600 mb-6">AI Money Maker</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Coin Theme (e.g. Gold, Silver, Pirate)</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Blue Tokens" className="w-full px-6 py-4 rounded-2xl border-2 border-yellow-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-yellow-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE COINS'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- NUMBER BONDS (Adding up to 10) --- */
const NumberBondsModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(NUMBER_BONDS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };

  const handleAnswer = (val: number) => {
    setUserAnswer(val);
    if (val === current.part2) onSound(`Yes! ${current.part1} and ${val} make ${current.target}! They are friends of ${current.target}!`);
    else onSound(`Not quite. Try counting how many more we need to reach ${current.target}.`);
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ target: z.union([z.literal(5), z.literal(10)]), part1: z.number(), part2: z.number(), theme: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({
        prompt: `Create a nursery "number bond" challenge for target 10 or 5. Theme: "${aiTopic}".`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-sm z-10"><i className="fas fa-magic"></i> AI Bond Assistant</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[550px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-pink-600 mb-8 uppercase tracking-tighter text-center">Friends of {current.target}! 🤝</h3>
        <div className="flex items-center gap-6 mb-10">
           <div className="w-24 h-24 bg-pink-500 text-white rounded-3xl flex items-center justify-center text-5xl font-black border-4 border-white shadow-xl">{current.part1}</div>
           <i className="fas fa-plus text-3xl text-gray-300"></i>
           <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-8 text-5xl font-black transition-all ${userAnswer === current.part2 ? 'bg-green-500 text-white border-white' : 'bg-pink-50 border-pink-100 text-pink-200 border-dashed animate-pulse'}`}>
             {userAnswer === current.part2 ? userAnswer : '?'}
           </div>
           <i className="fas fa-equals text-3xl text-gray-300"></i>
           <div className="w-24 h-24 bg-purple-600 text-white rounded-3xl flex items-center justify-center text-5xl font-black border-4 border-white shadow-xl">{current.target}</div>
        </div>
        <div onClick={() => onSound(`Who is the friend of ${current.part1} to make ${current.target}?`)} className="w-full max-w-2xl aspect-video bg-pink-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-pink-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
           {Array.from({length: current.target + 1}).map((_, i) => (
             <button key={i} onClick={() => handleAnswer(i)} className={`w-16 h-16 rounded-2xl font-black text-2xl transition-all border-4 ${userAnswer === i ? (i === current.part2 ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-pink-50 text-pink-500 border-white hover:bg-pink-100'}`}>{i}</button>
           ))}
        </div>
        {userAnswer === current.part2 && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Next Friends! ✨</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-pink-50"><h3 className="text-3xl font-black text-pink-600 mb-6">AI Bond Maker</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Subject</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Balloons, Puppies" className="w-full px-6 py-4 rounded-2xl border-2 border-pink-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-pink-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE BOND'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- NUMBERS SEQUENCE (Before, After, Between) --- */
const NumberSequenceModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(SEQUENCE_DATA);
  const [index, setIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  
  const current = data[index];

  useEffect(() => { setUserAnswer(null); }, [index, data]);

  const handleAnswer = (val: number) => {
    setUserAnswer(val);
    if (val === current.answer) onSound(`Yes! ${val} is correct!`);
    else onSound(`Try counting! What number should go there?`);
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ type: z.enum(["before", "after", "between"]), question: z.string(), sequence: z.array(z.number().nullable()), answer: z.number(), options: z.array(z.number()) });
    try {
      const { output } = await ai.generate({
        prompt: `Create a nursery "before, after, or between" number task for range "${aiTopic}". Numbers 1-100.`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-sm z-10"><i className="fas fa-magic"></i> AI Sequence</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase tracking-tighter text-center">{current.question}</h3>
        <div className="flex gap-4 mb-16 items-center">
           {current.sequence.map((n, i) => (
             <div key={i} className={`w-24 h-32 rounded-3xl flex items-center justify-center border-8 text-5xl font-black transition-all ${n === null ? (userAnswer === current.answer ? 'bg-green-500 text-white border-white scale-110' : 'bg-purple-50 border-purple-100 text-purple-200 border-dashed animate-pulse') : 'bg-white border-purple-50 text-purple-500 shadow-md'}`}>
               {n === null ? (userAnswer === current.answer ? userAnswer : '?') : n}
             </div>
           ))}
        </div>
        <div className="flex gap-6">
           {current.options.map(opt => (
             <button key={opt} onClick={() => handleAnswer(opt)} className={`w-20 h-20 rounded-3xl font-black text-3xl transition-all border-4 ${userAnswer === opt ? (opt === current.answer ? 'bg-green-500 text-white border-white' : 'bg-red-500 text-white border-white') : 'bg-purple-50 text-purple-400 border-white hover:bg-purple-100'}`}>{opt}</button>
           ))}
        </div>
        {userAnswer === current.answer && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-4 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce">NEXT ONE 🚀</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-purple-50"><h3 className="text-3xl font-black text-purple-600 mb-6">AI Sequence</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Number Range (e.g. 20-30)</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. 50-60" className="w-full px-6 py-4 rounded-2xl border-2 border-purple-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-purple-500 shadow-xl">CREATE MAGIC</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- NUMBER COMPARISON (Greater/Less) --- */
const NumberComparisonModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(NUM_COMPARISON_DATA);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const current = data[index];
  useEffect(() => { setUserAnswer(null); }, [index, data]);

  const handleChoice = (val: number | string) => {
    setUserAnswer(val);
    if (val === current.answer) onSound(`Excellent! You got it!`);
    else onSound(`Look closely at the numbers!`);
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ q: z.string(), val1: z.number(), val2: z.number(), answer: z.union([z.number(), z.string()]), type: z.enum(["greater", "less", "equal"]) });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a comparison task for "${aiTopic}". Max 100.`,
        output: { schema: resultSchema }
      });
      if(output){
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-sm z-10"><i className="fas fa-magic"></i> AI Compare</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-orange-600 mb-10 uppercase tracking-tighter text-center">{current.q}</h3>
        
        {current.type === 'equal' ? (
          <div className="flex flex-col items-center gap-12">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-orange-50 rounded-3xl flex items-center justify-center text-7xl font-black text-orange-500 shadow-xl border-4 border-white">{current.val1}</div>
              <div className="w-32 h-32 bg-orange-50 rounded-3xl flex items-center justify-center text-7xl font-black text-orange-500 shadow-xl border-4 border-white">{current.val2}</div>
            </div>
            <div className="flex gap-6">
              <button onClick={() => handleChoice('yes')} className={`px-12 py-5 rounded-3xl font-black text-2xl transition-all shadow-xl ${userAnswer === 'yes' ? 'bg-green-500 text-white' : 'bg-white text-green-500 border-4 border-green-50'}`}>YES!</button>
              <button onClick={() => handleChoice('no')} className={`px-12 py-5 rounded-3xl font-black text-2xl transition-all shadow-xl ${userAnswer === 'no' ? 'bg-red-500 text-white' : 'bg-white text-red-500 border-4 border-red-50'}`}>NO!</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-12 items-center">
            <button onClick={() => handleChoice(current.val1)} className={`w-40 h-48 rounded-[3rem] flex items-center justify-center text-8xl font-black transition-all border-8 ${userAnswer === current.val1 ? (current.val1 === current.answer ? 'bg-green-500 border-white text-white scale-110 shadow-2xl' : 'bg-red-500 border-white text-white') : 'bg-orange-50 border-orange-100 text-orange-400 hover:scale-105'}`}>{current.val1}</button>
            <i className="fas fa-arrows-left-right text-4xl text-gray-200"></i>
            <button onClick={() => handleChoice(current.val2)} className={`w-40 h-48 rounded-[3rem] flex items-center justify-center text-8xl font-black transition-all border-8 ${userAnswer === current.val2 ? (current.val2 === current.answer ? 'bg-green-500 border-white text-white scale-110 shadow-2xl' : 'bg-red-500 border-white text-white') : 'bg-orange-50 border-orange-100 text-orange-400 hover:scale-105'}`}>{current.val2}</button>
          </div>
        )}

        {userAnswer === current.answer && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-orange-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Next Game! 🎯</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-orange-50"><h3 className="text-3xl font-black text-orange-600 mb-6">AI Comparison</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Compare Subject</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Higher Numbers" className="w-full px-6 py-4 rounded-2xl border-2 border-orange-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-orange-500 shadow-xl">CREATE MAGIC</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- COUNTING GAME --- */
const CountingGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(COUNTING_TASK_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const current = data[index];
  const options = [current.count - 1, current.count, current.count + 2].sort(() => Math.random() - 0.5);

  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  
  const handleAnswer = (val: number) => {
    setUserAnswer(val);
    if (val === current.count) onSound(`Great counting! There are ${val} ${current.theme.toLowerCase()}!`);
    else onSound(`Let's count them one by one!`);
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ count: z.number().min(1).max(10), icon: z.string(), theme: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a counting task for theme "${aiTopic}". Count max 10.`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-sm z-10"><i className="fas fa-magic"></i> AI Counting</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-emerald-600 mb-10 uppercase tracking-tighter text-center">How Many? 🧮</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
           <div onClick={() => onSound(`How many ${current.theme.toLowerCase()} can you see?`)} className="relative aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
              {loading ? <div className="w-16 h-16 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
           </div>
           <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-gray-400 mb-8 uppercase tracking-widest text-center">Count the {current.theme}!</p>
              <div className="grid grid-cols-3 gap-4">
                 {options.filter(o => o > 0).map(opt => (
                   <button key={opt} onClick={() => handleAnswer(opt)} className={`w-20 h-20 rounded-3xl font-black text-4xl transition-all border-4 ${userAnswer === opt ? (opt === current.count ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-emerald-50 text-emerald-500 border-white hover:bg-emerald-100'}`}>{opt}</button>
                 ))}
              </div>
           </div>
        </div>
        {userAnswer === current.count && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Next Count! 🦁</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6">AI Counting</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Subject</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Flying Birds" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">CREATE COUNTING</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- NUMBERS MAIN (Up to 100) --- */
const NumbersMainModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(NUMERACY_DATA.numbers);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  
  const current = data[index];
  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleLearn = () => onSound(`This is number ${current.value}. Let's count!`);

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ value: z.number(), word: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({
        prompt: `Generate a visual counting prompt for number ${index + 1} with theme "${aiTopic}".`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => prev.map((item, i) => i === index ? { ...item, ...output } : item));
        setIsDrawerOpen(false); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10"><i className="fas fa-magic"></i> Custom Theme</button>
      <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-purple-100 animate-in zoom-in duration-500 min-h-[550px]">
        <h2 className="text-9xl font-black text-purple-600 mb-2 drop-shadow-xl">{current.value}</h2>
        <p className="text-3xl font-bold text-gray-400 italic mb-10">{current.wordName || current.word || current.value}</p>
        <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-purple-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />}
        </div>
        <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase">Learn</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-right text-2xl"></i></button></div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-purple-50"><h3 className="text-3xl font-black text-purple-600 mb-6">Change Theme</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">New Topic for {current.value}</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Red Firetrucks" className="w-full px-6 py-4 rounded-2xl border-2 border-purple-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-purple-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'UPDATE MAGICALLY'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- TENS AND UNITS --- */
const TensUnitsModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(TENS_UNITS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const current = data[index];
  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleLearn = () => onSound(`${current.number} has ${current.tens} ten and ${current.units} units! Let's see the ${current.theme.toLowerCase()}.`);

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ number: z.number(), tens: z.literal(1), units: z.number(), theme: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a Nursery Place Value (Tens/Units) example for a number between 11-19. Theme: "${aiTopic}".`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-magic"></i> AI Place Value</button>
      <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 animate-in zoom-in duration-500 min-h-[550px]">
        <h3 className="text-4xl font-black text-indigo-500 mb-8 uppercase tracking-tighter text-center">Tens and Units 📦</h3>
        <div className="flex items-center gap-12 mb-10">
           <div className="text-center"><p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Number</p><div className="w-24 h-24 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-5xl font-black shadow-xl border-4 border-white">{current.number}</div></div>
           <i className="fas fa-equals text-2xl text-gray-300"></i>
           <div className="flex gap-4">
              <div className="text-center"><p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Tens</p><div className="w-16 h-16 bg-white border-4 border-indigo-200 text-indigo-500 rounded-xl flex items-center justify-center text-3xl font-black">{current.tens}</div></div>
              <div className="text-center"><p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Units</p><div className="w-16 h-16 bg-white border-4 border-indigo-200 text-indigo-500 rounded-xl flex items-center justify-center text-3xl font-black">{current.units}</div></div>
           </div>
        </div>
        <div onClick={handleLearn} className="w-full max-w-2xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
        </div>
        <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-indigo-500 text-white font-black rounded-2xl shadow-xl uppercase">Teach Me!</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-right text-2xl"></i></button></div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-indigo-50"><h3 className="text-3xl font-black text-indigo-600 mb-6">Tens & Units AI</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Eggs in Carton" className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-indigo-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE LESSON'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- GROUPING --- */
const GroupingModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(GROUPING_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const current = data[index];
  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleLearn = () => onSound(`Let's count in ${current.groupSize}s! We have ${current.totalItems} ${current.theme.toLowerCase()} in groups of ${current.groupSize}.`);

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ groupSize: z.union([z.literal(2), z.literal(3)]), totalItems: z.number(), theme: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a Nursery Grouping example. Group size 2 or 3. Theme: "${aiTopic}".`,
        output: { schema: resultSchema }
      });
      if(output) {
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-magic"></i> AI Grouping</button>
      <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 animate-in zoom-in duration-500 min-h-[550px]">
        <h3 className="text-4xl font-black text-emerald-500 mb-8 uppercase tracking-tighter text-center">Grouping Fun 🤝</h3>
        <div className="flex items-center gap-12 mb-10">
           <div className="text-center"><p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Group Size</p><div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white">{current.groupSize}</div></div>
           <i className="fas fa-arrow-right text-2xl text-gray-300"></i>
           <div className="text-center"><p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total {current.theme}</p><div className="w-20 h-20 bg-white border-4 border-emerald-200 text-emerald-500 rounded-2xl flex items-center justify-center text-4xl font-black">{current.totalItems}</div></div>
        </div>
        <div onClick={handleLearn} className="w-full max-w-2xl aspect-video bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
        </div>
        <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-emerald-500 text-white font-black rounded-2xl shadow-xl uppercase">Count Groups!</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-right text-2xl"></i></button></div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6">Grouping AI</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Friendly Bears" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE GROUPING'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- NUMBER WORDS --- */
const NumberWordsModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [items, setItems] = useState(NUMBER_WORDS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const current = items[index];
  useEffect(() => { fetchVisual(); }, [index, items]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleLearn = () => onSound(`Number ${current.digit} is spelled... ${current.word}. Can you spell it with me?`);
  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    const resultSchema = z.object({ digit: z.number(), word: z.string(), icon: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a visual for number word ${current.digit} with theme "${aiTheme}".`,
        output: { schema: resultSchema }
      });
      if (output) {
        setItems(prev => prev.map((item, i) => i === index ? { ...item, ...output } : item));
        setIsTeacherDrawerOpen(false); setAiTheme('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-500 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-wand-magic-sparkles"></i> Theme AI</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[550px] animate-in zoom-in duration-500">
        <div className="flex items-center gap-6 mb-10"><div className="w-24 h-24 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-6xl font-black shadow-xl border-4 border-white">{current.digit}</div><i className="fas fa-arrow-right text-3xl text-purple-300"></i><div className="px-10 py-4 bg-purple-50 border-4 border-dashed border-purple-300 rounded-[2rem]"><span className="text-6xl font-black text-purple-600 uppercase tracking-tighter">{current.word}</span></div></div>
        <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">{loading ? <div className="w-16 h-16 border-8 border-purple-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />}</div>
        <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? items.length - 1 : p - 1))} className="w-14 h-14 bg-purple-100 text-purple-50 rounded-full flex items-center justify-center hover:bg-purple-200 active:scale-90 shadow-md"><i className="fas fa-arrow-left text-xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase">Teach Me!</button><button onClick={() => setIndex(p => (p + 1) % items.length)} className="w-14 h-14 bg-purple-100 text-purple-50 rounded-full flex items-center justify-center hover:bg-purple-200 active:scale-90 shadow-md"><i className="fas fa-arrow-right text-xl"></i></button></div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-purple-50"><h3 className="text-3xl font-black text-purple-600 mb-6">AI Word Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Topic</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. Stars" className="w-full px-6 py-4 rounded-2xl border-2 border-purple-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-purple-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC THEME'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- ADDITION --- */
const AdditionModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(ADDITION_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const current = data[index];
  const correct = current.val1 + current.val2;
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleAnswer = (val: number) => { setUserAnswer(val); if (val === correct) onSound(`Yes! ${current.val1} plus ${current.val2} is ${correct}!`); else onSound(`Try counting again!`); };
  
  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    const resultSchema = z.object({ val1: z.number(), val2: z.number(), icon: z.string(), theme: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({
        prompt: `Generate a nursery addition problem for theme "${aiTheme}". Sum max 10.`,
        output: { schema: resultSchema }
      });
      if(output) {
        setData(prev => [...prev, output]); setIsDrawerOpen(false); setIndex(data.length); setAiTheme('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-500 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest z-10"><i className="fas fa-plus"></i> Add Sum</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <h3 className="text-4xl font-black text-orange-500 mb-10 uppercase tracking-tighter">Addition ➕</h3>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
              {Array.from({length: current.val1}).map((_, i) => <i key={i} className={`fas ${current.icon} text-3xl text-orange-400 animate-bounce`} style={{animationDelay: `${i*0.2}s`}}></i>)}
            </div>
            <i className="fas fa-plus text-3xl text-gray-300"></i>
            <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
              {Array.from({length: current.val2}).map((_, i) => <i key={i} className={`fas ${current.icon} text-3xl text-orange-400 animate-bounce`} style={{animationDelay: `${(i+current.val1)*0.2}s`}}></i>)}
            </div>
          </div>
          <div className="w-48 h-48 bg-white border-4 border-orange-50 rounded-[2.5rem] shadow-xl overflow-hidden relative">
            {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"><i className="fas fa-plus text-orange-200 text-4xl"></i></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-2" />}
          </div>
        </div>
        <div className="text-center mb-10"><p className="text-5xl font-black text-orange-600">{current.val1} + {current.val2} = ?</p></div>
        <div className="flex flex-wrap justify-center gap-3">{Array.from({length: 11}).map((_, i) => (<button key={i} onClick={() => handleAnswer(i)} className={`w-14 h-14 rounded-2xl font-black text-xl transition-all border-4 ${userAnswer === i ? (i === correct ? 'bg-green-500 text-white border-white' : 'bg-red-500 text-white border-white') : 'bg-orange-50 text-orange-400 border-white'}`}>{i}</button>))}</div>
        {userAnswer === correct && (<button onClick={() => setIndex(i => (i + 1) % data.length)} className="mt-12 px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Next Sum! 🚀</button>)}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-orange-50"><h3 className="text-3xl font-black text-orange-600 mb-6">Addition AI</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Subject</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. Toys" className="w-full px-6 py-4 rounded-2xl border-2 border-orange-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-orange-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE ADDITION'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- SUBTRACTION --- */
const SubtractionModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(SUBTRACTION_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const current = data[index];
  const correct = current.val1 - current.val2;
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleAnswer = (val: number) => { setUserAnswer(val); if (val === correct) onSound(`Correct! ${current.val1} take away ${current.val2} is ${correct}!`); else onSound(`Count carefully! How many are left?`); };
  
  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    const resultSchema = z.object({ val1: z.number(), val2: z.number(), icon: z.string(), theme: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a nursery subtraction problem for theme "${aiTheme}". val1 max 10.`,
        output: { schema: resultSchema }
      });
      if(output) {
        setData(prev => [...prev, output]); setIsDrawerOpen(false); setIndex(data.length); setAiTheme('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-red-200 text-red-500 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest z-10"><i className="fas fa-plus"></i> Add Subtraction</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-red-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <h3 className="text-4xl font-black text-red-500 mb-10 uppercase tracking-tighter">Subtraction! ➖</h3>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-4 bg-red-50 rounded-2xl border-2 border-red-100">
              {Array.from({length: current.val1}).map((_, i) => <i key={i} className={`fas ${current.icon} text-3xl ${i >= current.val1 - current.val2 ? 'text-gray-200 opacity-30 line-through' : 'text-red-400 animate-pulse'}`}></i>)}
            </div>
            <i className="fas fa-minus text-3xl text-gray-300"></i>
            <div className="w-12 h-12 flex items-center justify-center bg-red-50 rounded-xl text-3xl font-black text-red-500">{current.val2}</div>
          </div>
          <div className="w-48 h-48 bg-white border-4 border-red-50 rounded-[2.5rem] shadow-xl overflow-hidden relative">
            {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"><i className="fas fa-minus text-red-200 text-4xl"></i></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-2" />}
          </div>
        </div>
        <div className="text-center mb-10"><p className="text-5xl font-black text-red-600">{current.val1} - {current.val2} = ?</p></div>
        <div className="flex flex-wrap justify-center gap-3">{Array.from({length: 11}).map((_, i) => (<button key={i} onClick={() => handleAnswer(i)} className={`w-14 h-14 rounded-2xl font-black text-xl transition-all border-4 ${userAnswer === i ? (i === correct ? 'bg-green-500 text-white border-white' : 'bg-red-500 text-white border-white') : 'bg-red-50 text-red-400'}`}>{i}</button>))}</div>
        {userAnswer === correct && (<button onClick={() => setIndex(i => (i + 1) % data.length)} className="mt-12 px-12 py-4 bg-green-500 text-white font-black rounded-3xl shadow-xl uppercase">Next Sum! 🚀</button>)}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-red-50"><h3 className="text-3xl font-black text-red-600 mb-6">Subtraction AI</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Subject</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. Cookies" className="w-full px-6 py-4 rounded-2xl border-2 border-red-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-red-500 shadow-xl">CREATE SUBTRACTION</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- TELLING THE TIME --- */
const TellingTimeModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(TIME_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSetting, setAiSetting] = useState('');
  const [answered, setAnswered] = useState(false);
  const current = data[index];
  const options = [current.hour, (current.hour + 2) % 12 || 12, (current.hour + 5) % 12 || 12].sort(() => Math.random() - 0.5);
  useEffect(() => { fetchVisual(); setAnswered(false); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleAnswer = (val: number) => { if (val === current.hour) { setAnswered(true); onSound(`Yes! It is ${current.phrase}!`); } else onSound(`Look at the short hand! What number is it on?`); };
  
  const generateWithAi = async () => {
    if (!aiSetting) return; setIsAiLoading(true);
    const resultSchema = z.object({ hour: z.number(), minute: z.literal(0), phrase: z.string(), prompt: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a nursery time telling problem for "${aiSetting}" O'clock.`,
        output: { schema: resultSchema }
      });
      if(output){
        setData(prev => [...prev, output]);
        setIsDrawerOpen(false); setIndex(data.length); setAiSetting('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-500 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest z-10"><i className="fas fa-plus"></i> Add Time</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-blue-500 mb-8 uppercase tracking-tighter">Clock Time ⏰</h3>
        <div className="w-80 h-80 bg-blue-50 rounded-full border-8 border-white shadow-2xl overflow-hidden mb-12 relative group cursor-pointer" onClick={() => onSound(current.phrase)}>
          {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10" />}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white opacity-0 group-hover:opacity-100 text-6xl drop-shadow-lg"></i></div>
        </div>
        <p className="text-2xl font-bold text-gray-500 mb-8 uppercase tracking-widest">What time is it?</p>
        <div className="flex gap-6">{options.map(opt => (<button key={opt} onClick={() => handleAnswer(opt)} className={`px-12 py-5 rounded-3xl font-black text-4xl transition-all border-4 ${answered && opt === current.hour ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-blue-50 text-blue-500 border-white hover:bg-blue-100'}`}>{opt}:00</button>))}</div>
        {answered && (<button onClick={() => setIndex(i => (i + 1) % data.length)} className="mt-12 px-10 py-4 bg-green-500 text-white font-black rounded-2xl shadow-lg uppercase">Next Clock! 🕒</button>)}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6">Time AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Target Hour</label><input type="number" min="1" max="12" value={aiSetting} onChange={(e) => setAiSetting(e.target.value)} placeholder="1-12" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 focus:border-blue-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiSetting} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">CREATE TIME</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- MEASUREMENT --- */
const MeasurementModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [subTab, setSubTab] = useState<'weight' | 'height'>('weight');
  const [data, setData] = useState(MEASUREMENT_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const current = data[subTab][index];
  useEffect(() => { fetchVisuals(); setAnswered(false); }, [index, subTab, data]);
  const fetchVisuals = async () => { setLoading(true); const urls = await Promise.all(current.items.map(i => generateLessonImage(i.prompt))); setImageUrls(urls); setLoading(false); };
  const handleChoice = (idx: number) => { if (idx === current.correct) { setAnswered(true); onSound(`Yes! The ${current.items[idx].label} is ${subTab === 'weight' ? 'heavier' : 'taller'}!`); } else onSound(`Look again! Which one is ${subTab === 'weight' ? 'heavier' : 'taller'}?`); };
  
  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    const resultSchema = z.object({ q: z.string(), category: z.string(), options: z.array(z.object({ label: z.string(), prompt: z.string(), size: z.enum(['lg', 'sm']) })), correct: z.number() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a ${subTab} comparison for theme "${aiTheme}".`,
        output: { schema: resultSchema }
      });
      if(output) {
        setData((prev: any) => ({ ...prev, [subTab]: [...prev[subTab], output] }));
        setIsTeacherDrawerOpen(false); setIndex(data[subTab].length); setAiTheme('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  return (
    <div className="relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10"><i className="fas fa-plus"></i> Add Measure</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <div className="flex gap-4 mb-10 p-2 bg-emerald-50 rounded-2xl">{(['weight', 'height'] as const).map(t => (<button key={t} onClick={() => { setSubTab(t); setIndex(0); }} className={`px-8 py-2 rounded-xl font-black text-xs uppercase transition-all ${subTab === t ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-300'}`}>{t}</button>))}</div>
        <h3 className="text-4xl font-black text-emerald-600 mb-12 uppercase tracking-tighter">{current.q}</h3>
        <div className="flex flex-wrap justify-center gap-12 items-end">
          {current.items.map((item, idx) => (<button key={idx} onClick={() => handleChoice(idx)} className={`flex flex-col items-center group transition-all ${answered && idx === current.correct ? 'scale-110' : ''}`}><div className={`${opt.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28'} bg-emerald-50 rounded-[3rem] border-8 flex items-center justify-center mb-4 transition-all overflow-hidden ${answered && idx === current.correct ? 'border-green-400 shadow-2xl' : 'border-white hover:border-emerald-200 shadow-xl'}`}>{imageUrls[idx] ? <img src={imageUrls[idx]!} className="w-full h-full object-cover p-6" /> : <i className="fas fa-shapes text-emerald-100 text-6xl animate-pulse"></i>}</div><span className="font-black uppercase text-sm tracking-widest text-emerald-400">{item.label}</span></button>))}
        </div>
        {answered && (<button onClick={() => { setIndex(i => (i + 1) % data[subTab].length); setAnswered(false); }} className="mt-12 px-12 py-4 bg-green-500 text-white font-black rounded-3xl shadow-lg uppercase">Next! 🚀</button>)}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6">Measure AI</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Comparison Topic</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. Tree vs Bush" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">CREATE MEASURE</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- SHAPES --- */
const ShapesModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data, setData] = useState(NUMERACY_DATA.shapes);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiName, setAiName] = useState('');

  const current = data[index];
  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  const handleLearn = () => onSound(`This is a ${current.name}! It is a ${current.type} shape.`);

  const generateWithAi = async () => {
    if (!aiName) return; setIsAiLoading(true);
    const resultSchema = z.object({ name: z.string(), type: z.enum(["2D", "3D"]), prompt: z.string(), description: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Generate a 2D or 3D shape identification and description for "${aiName}".`,
        output: { schema: resultSchema }
      });
      if (output) {
        setData(prev => [...prev, output]); 
        setIsDrawerOpen(false); setIndex(data.length); setAiName('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-cyan-200 text-cyan-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10"><i className="fas fa-plus"></i> Add Shape</button>
      <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-cyan-100 animate-in slide-in-from-bottom duration-500 min-h-[550px]">
        <div className="text-center mb-8"><h2 className="text-7xl font-black text-cyan-600 mb-2">{current.name}</h2><span className="px-6 py-1 bg-cyan-100 text-cyan-600 rounded-full text-xs font-black uppercase tracking-widest">{current.type} Shape</span></div>
        <div onClick={handleLearn} className="w-80 h-80 bg-cyan-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />}
        </div>
        <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200 active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-cyan-500 text-white font-black rounded-2xl shadow-xl">TEACH ME!</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200 active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-right text-2xl"></i></button></div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-cyan-50"><h3 className="text-3xl font-black text-cyan-600 mb-6">AI Shape Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Shape Name</label><input type="text" value={aiName} onChange={(e) => setAiName(e.target.value)} placeholder="e.g. Star, Heart" className="w-full px-6 py-4 rounded-2xl border-2 border-cyan-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiName} className="w-full py-5 rounded-2xl font-black text-white bg-cyan-500 shadow-xl">MAGIC SHAPE</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- COMPARISON --- */
const ComparisonGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [level, setLevel] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [data, setData] = useState(NUMERACY_DATA.comparisons);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const currentLevel = data[level];
  useEffect(() => { fetchVisuals(); }, [level, data]);
  const fetchVisuals = async () => { const urls = await Promise.all(currentLevel.options.map(opt => generateLessonImage(opt.prompt))); setImageUrls(urls); };
  const handleChoice = (idx: number) => { if (answered) return; if (idx === currentLevel.correct) { setAnswered(true); onSound(`Yes! That is correct!`); } else onSound(`Oh, let's try again!`); };
  
  const generateWithAi = async () => {
    if (!newName) return; setIsMagicLoading(true);
    const resultSchema = z.object({ q: z.string(), category: z.string(), options: z.array(z.object({ label: z.string(), prompt: z.string(), size: z.enum(['lg', 'sm']) })), correct: z.number() });
    try {
      const { output } = await ai.generate({ 
          prompt: `Generate a weight/height comparison for "${newName}".`,
          output: { schema: resultSchema }
      });
      if(output){
        setData(prev => [...prev, output]);
        setIsAdminOpen(false); setLevel(data.length); setNewName('');
      }
    } catch (e) { console.error(e); } finally { setIsMagicLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10"><i className="fas fa-plus"></i> AI Assistant</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-orange-500 mb-12 text-center uppercase tracking-tighter">{currentLevel.q}</h3>
        <div className="flex flex-wrap justify-center gap-12 items-end">
          {currentLevel.options.map((opt, idx) => (<button key={idx} onClick={() => handleChoice(idx)} className={`flex flex-col items-center group transition-all ${answered && idx === currentLevel.correct ? 'scale-110' : ''}`}><div className={`${opt.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28'} bg-orange-50 rounded-[3rem] border-8 flex items-center justify-center mb-4 transition-all overflow-hidden ${answered && idx === currentLevel.correct ? 'border-green-400 shadow-2xl' : 'border-white hover:border-orange-200 shadow-xl'}`}>{imageUrls[idx] ? <img src={imageUrls[idx]!} className="w-full h-full object-cover p-6 drop-shadow-lg" /> : <i className="fas fa-shapes text-orange-200"></i>}</div><span className="font-black uppercase text-sm tracking-widest">{opt.label}</span></button>))}
        </div>
        {answered && (<button onClick={() => { setLevel(p => (p+1)%data.length); setAnswered(false); }} className="mt-12 px-12 py-4 bg-green-500 text-white font-black rounded-3xl shadow-xl animate-bounce">NEXT <i className="fas fa-arrow-right"></i></button>)}
      </div>
      {isAdminOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-orange-50"><h3 className="text-3xl font-black text-gray-800 tracking-tight">AI Comparison</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Compare Topic</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Big Elephant/Small Ant" className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100" /></div><button onClick={generateWithAi} disabled={isMagicLoading || !newName} className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl">{isMagicLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC CREATE'}</button><button onClick={() => setIsAdminOpen(false)} className="w-full py-2 text-gray-400">Close</button></div></div></div>}
    </div>
  );
};

/* --- PATTERNS --- */
const PatternGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [level, setLevel] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [patterns, setPatterns] = useState(NUMERACY_DATA.patterns);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const currentPattern = patterns[level];
  const handleChoice = (opt: string) => { if (opt === currentPattern.next) { setAnswered(true); onSound(`Great job!`); } else onSound(`Try again!`); };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ sequence: z.array(z.string()), next: z.string(), options: z.array(z.string()) });
    try {
      const { output } = await ai.generate({ 
        prompt: `Create a nursery pattern related to "${aiTopic}". Icons are FontAwesome (no fa- prefix).`,
        output: { schema: resultSchema }
      });
      if(output){
        setPatterns(prev => [...prev, output]); setIsDrawerOpen(false); setLevel(patterns.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10"><i className="fas fa-plus"></i> AI Pattern</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center">
        <h3 className="text-3xl font-black text-blue-500 mb-12 uppercase tracking-tight">What comes next?</h3>
        <div className="flex gap-4 mb-16 bg-blue-50 p-8 rounded-[3rem] border-4 border-dashed border-blue-200 flex-wrap justify-center">{currentPattern.sequence.map((item, idx) => (<div key={idx} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md"><i className={`fas fa-${item} text-4xl text-blue-400`}></i></div>))}</div>
        <div className="flex gap-8 flex-wrap justify-center">{currentPattern.options.map((opt, idx) => (<button key={idx} onClick={() => handleChoice(opt)} className={`w-32 h-32 bg-white rounded-[2rem] border-8 flex items-center justify-center shadow-xl transition-all ${answered && opt === currentPattern.next ? 'border-green-400 scale-110 shadow-green-100' : 'border-gray-100 hover:border-blue-100'}`}><i className={`fas ${opt.startsWith('fa-') ? '' : 'fa-'}${opt} text-6xl text-blue-400`}></i></button>))}</div>
        {answered && <button onClick={() => { setLevel(p => (p+1)%patterns.length); setAnswered(false); }} className="mt-12 px-10 py-4 bg-green-500 text-white font-black rounded-2xl animate-bounce">NEXT PATTERN</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6">AI Pattern Creator</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme for Icons</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Garden, Kitchen" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">CREATE MAGICALLY</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- ONE TO ONE --- */
const OneToOneGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [level, setLevel] = useState(0);
  const [givenCount, setGivenCount] = useState(0);
  const [data, setData] = useState(NUMERACY_DATA.oneToOne);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  
  const current = data[level];
  const handleGive = () => { if (givenCount < current.count) { setGivenCount(prev => prev + 1); onSound(`One for the ${current.name}!`); } };
  
  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    const resultSchema = z.object({ count: z.number().min(1).max(5), character: z.string(), item: z.string(), name: z.string(), itemName: z.string() });
    try {
      const { output } = await ai.generate({ 
        prompt: `Create a 1-to-1 match task for theme "${aiTopic}".`,
        output: { schema: resultSchema }
      });
      if(output){
        setData(prev => [...prev, output]); setIsDrawerOpen(false); setLevel(data.length); setGivenCount(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-cyan-200 text-cyan-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10"><i className="fas fa-plus"></i> AI Correspondence</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-3xl font-black text-cyan-500 mb-8 uppercase tracking-tight">One for You, One for Me!</h3>
        <p className="text-gray-400 font-bold mb-10 italic">Give each {current.name} one {current.itemName}!</p>
        <div className="flex flex-col gap-16 w-full items-center">
          <div className="flex gap-8 justify-center flex-wrap">{Array.from({ length: current.count }).map((_, i) => (<div key={i} className="relative transition-all duration-500"><i className={`fas ${current.character} text-6xl ${i < givenCount ? 'text-cyan-500 scale-110' : 'text-cyan-200'}`}></i>{i < givenCount && (<div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce"><i className={`fas ${current.item} text-3xl text-orange-400`}></i></div>)}</div>))}</div>
          <div className="flex gap-6 justify-center flex-wrap">{Array.from({ length: current.count }).map((_, i) => (<button key={i} onClick={handleGive} disabled={i < givenCount} className={`w-20 h-20 bg-cyan-50 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 ${i < givenCount ? 'opacity-0 scale-0' : 'border-white hover:border-cyan-200 shadow-md hover:scale-110'}`}><i className={`fas ${current.item} text-4xl text-cyan-400`}></i></button>))}</div>
        </div>
        {givenCount === current.count && <button onClick={() => { setLevel(p => (p+1)%data.length); setGivenCount(0); }} className="mt-12 px-10 py-4 bg-green-500 text-white font-black rounded-2xl animate-bounce">NEXT LEVEL</button>}
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-cyan-50"><h3 className="text-3xl font-black text-cyan-600 mb-6">AI Correspondence</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Hungry Monkeys" className="w-full px-6 py-4 rounded-2xl border-2 border-cyan-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-cyan-500 shadow-xl">CREATE MAGICALLY</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

const NumberMagicPen: React.FC = () => {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedItem, setSelectedItem] = useState('1');
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = traceCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const fontSize = parseInt(selectedItem) >= 100 ? 180 : parseInt(selectedItem) >= 10 ? 250 : 320;
    ctx.font = `900 ${fontSize}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 4; ctx.setLineDash([5, 5]); ctx.strokeText(selectedItem, canvas.width / 2, canvas.height / 2 + 20);
    clearFree();
  }, [selectedItem]);

  const clearFree = () => {
    const canvas = freeCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
  };

  const startDraw = (e: any) => {
    isDrawingRef.current = true;
    const canvas = freeCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.strokeStyle = '#8B5CF6';
  };

  const draw = (e: any) => {
    if (!isDrawingRef.current) return;
    const canvas = freeCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
  };

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto space-y-6">
      <div className="flex overflow-x-auto gap-3 pb-2 w-full max-w-2xl no-scrollbar px-4">
        {Array.from({length: 101}).map((_, i) => (<button key={i} onClick={() => setSelectedItem(i.toString())} className={`flex-shrink-0 w-14 h-14 rounded-2xl font-black text-xl flex items-center justify-center transition-all ${selectedItem === i.toString() ? 'bg-purple-500 text-white scale-110 shadow-lg' : 'bg-white text-purple-300 border-2 border-purple-50'}`}>{i}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-4">
           <h3 className="text-xl font-black text-purple-400 uppercase tracking-widest text-center">Trace Me</h3>
           <canvas ref={traceCanvasRef} width={400} height={400} className="bg-white border-8 border-purple-100 rounded-[3rem] shadow-xl w-full" />
        </div>
        <div className="flex flex-col gap-4">
           <div className="flex justify-between items-center px-4">
             <h3 className="text-xl font-black text-purple-600 uppercase tracking-widest">Your Turn</h3>
             <button onClick={clearFree} className="text-xs font-bold text-gray-400 uppercase hover:text-red-400 transition-colors"><i className="fas fa-trash"></i> Clear</button>
           </div>
           <canvas ref={freeCanvasRef} width={400} height={400} 
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => isDrawingRef.current = false} onMouseLeave={() => isDrawingRef.current = false}
            onTouchStart={(e) => { e.preventDefault(); startDraw(e); }} onTouchMove={(e) => { e.preventDefault(); draw(e); }} onTouchEnd={() => isDrawingRef.current = false}
            className="bg-white border-8 border-purple-500 rounded-[3rem] shadow-xl w-full cursor-crosshair" />
        </div>
      </div>
    </div>
  );
};

export default NumeracyZone;

    