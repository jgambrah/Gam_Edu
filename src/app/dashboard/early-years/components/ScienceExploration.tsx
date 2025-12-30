
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCIENCE_DATA } from '../constants';
import { generateLessonImage, generateTTS, generateAnimalDetails, generateConceptDetails, generateSkillDetails } from '../services/gemini';
import { playRawPcm } from '../services/audio';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

type ScienceTab = 'body' | 'organs' | 'growth' | 'senses' | 'diet' | 'dentist' | 'health' | 'water' | 'float-sink' | 'needs' | 'living' | 'weather' | 'animals' | 'transport' | 'concepts' | 'skills';

const ScienceExploration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScienceTab>('body');
  const [playing, setPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const playFeedbackSound = useCallback(async (text: string) => {
    if (!text) return;
    setErrorMsg('');
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
    }
    setPlaying(true);
    try {
      const base64 = await generateTTS(text, 'Kore');
      if (base64) {
        const source = await playRawPcm(base64);
        if (source) {
          currentSourceRef.current = source;
          source.onended = () => { setPlaying(false); currentSourceRef.current = null; };
        } else { setPlaying(false); }
      } else { setPlaying(false); }
    } catch (err: any) {
      setPlaying(false);
      if (err.message === 'QUOTA_EXCEEDED') {
        setErrorMsg('Tutor is resting! Click "Setup Key" at the top.');
      }
    }
  }, []);

  const tabs: {id: ScienceTab, label: string, icon: string}[] = [
    { id: 'body', label: 'My Body', icon: 'fa-user' },
    { id: 'organs', label: 'Inside Me', icon: 'fa-heart-pulse' },
    { id: 'growth', label: 'Growing Up', icon: 'fa-arrow-up-right-dots' },
    { id: 'senses', label: 'My Senses', icon: 'fa-ear-listen' },
    { id: 'water', label: 'Water World', icon: 'fa-droplet' },
    { id: 'float-sink', label: 'Float or Sink', icon: 'fa-anchor' },
    { id: 'needs', label: 'What we Need', icon: 'fa-hands-holding-child' },
    { id: 'diet', label: 'Healthy Food', icon: 'fa-apple-whole' },
    { id: 'dentist', label: 'The Dentist', icon: 'fa-tooth' },
    { id: 'health', label: 'Health Care', icon: 'fa-stethoscope' },
    { id: 'living', label: 'Living Things', icon: 'fa-leaf' },
    { id: 'weather', label: 'Weather', icon: 'fa-cloud-sun' },
    { id: 'animals', label: 'Animals', icon: 'fa-paw' },
    { id: 'transport', label: 'Travel', icon: 'fa-car' },
    { id: 'concepts', label: 'Concepts', icon: 'fa-shapes' },
    { id: 'skills', label: 'Skills', icon: 'fa-magnifying-glass' },
  ];

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-6 pb-20">
      <div className="text-center mb-4">
        <h2 className="text-5xl font-black text-green-600 uppercase tracking-tighter">Science Lab 🔬</h2>
        <p className="text-gray-400 font-bold italic">Let's discover our wonderful world!</p>
      </div>

      {errorMsg && (
        <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-2xl font-bold text-sm animate-bounce flex items-center gap-3">
          <i className="fas fa-circle-exclamation"></i>{errorMsg}
        </div>
      )}

      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-2 bg-white p-3 rounded-[3rem] shadow-2xl border-4 border-green-50 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[100px] px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex flex-col items-center gap-1 ${
                activeTab === tab.id ? 'bg-green-500 text-white shadow-lg scale-105' : 'text-green-300 hover:bg-green-50'
              }`}
            >
              <i className={`fas ${tab.icon} text-lg`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4">
        {activeTab === 'body' && <BodyDiscovery onSound={playFeedbackSound} />}
        {activeTab === 'organs' && <InnerOrgans onSound={playFeedbackSound} />}
        {activeTab === 'growth' && <GrowthAndChange onSound={playFeedbackSound} />}
        {activeTab === 'senses' && <SensesLab onSound={playFeedbackSound} />}
        {activeTab === 'water' && <WaterWorld onSound={playFeedbackSound} />}
        {activeTab === 'float-sink' && <FloatSinkLab onSound={playFeedbackSound} />}
        {activeTab === 'needs' && <LivingNeeds onSound={playFeedbackSound} />}
        {activeTab === 'diet' && <BalancedDiet onSound={playFeedbackSound} />}
        {activeTab === 'dentist' && <DentistVisit onSound={playFeedbackSound} />}
        {activeTab === 'health' && <HealthCare onSound={playFeedbackSound} />}
        {activeTab === 'living' && <LivingSorting onSound={playFeedbackSound} />}
        {activeTab === 'weather' && <WeatherWindow onSound={playFeedbackSound} />}
        {activeTab === 'animals' && <AnimalKingdom onSound={playFeedbackSound} />}
        {activeTab === 'transport' && <TransportExplorer onSound={playFeedbackSound} />}
        {activeTab === 'concepts' && <ConceptsZone onSound={playFeedbackSound} isGlobalPlaying={playing} />}
        {activeTab === 'skills' && <SkillsLab onSound={playFeedbackSound} isGlobalPlaying={playing} />}
      </div>
    </div>
  );
};

const WaterWorld: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [data, setData] = useState(SCIENCE_DATA.water);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    useEffect(() => { fetchVisual(); }, [index, data]);
    const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
    const handleLearn = () => onSound(`This is water from ${current.source.toLowerCase()}. We use it for ${current.use.toLowerCase()}.`);
  
    const generateWithAi = async () => {
      if (!aiTopic) return;
      setIsAiLoading(true);
      const resultSchema = z.object({ source: z.string(), use: z.string(), prompt: z.string(), icon: z.string() });
      try {
        const { output } = await ai.generate({
          prompt: `Generate a Nursery 1 Water property/use example for "${aiTopic}".`,
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
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-magic"></i> AI Water Assistant</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h3 className="text-4xl font-black text-blue-500 mb-8 uppercase tracking-tighter text-center">Water World 💧</h3>
          <div className="flex items-center gap-8 mb-10">
             <div className="w-20 h-20 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-4xl shadow-xl border-4 border-white"><i className={`fas ${current.icon}`}></i></div>
             <div className="text-center">
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Source</p>
               <h4 className="text-4xl font-black text-blue-600 uppercase">{current.source}</h4>
             </div>
          </div>
          <div onClick={handleLearn} className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
          </div>
          <div className="bg-blue-50 p-8 rounded-3xl border-4 border-dashed border-blue-200 mb-10 text-center"><p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">How we use it:</p><p className="text-2xl font-bold text-blue-800 italic">"{current.use}"</p></div>
          <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-blue-500 text-white font-black rounded-2xl shadow-xl uppercase">Splash!</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-right text-2xl"></i></button></div>
        </div>
        {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6">AI Water Lesson</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Water Scene/Source</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Ice cube, Waterfall" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC CREATE'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
      </div>
    );
};

const FloatSinkLab: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [items, setItems] = useState(SCIENCE_DATA.floatSink);
    const [index, setIndex] = useState(0);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = items[index];
    useEffect(() => { fetchVisual(); setPrediction(null); setRevealed(false); }, [index, items]);
    const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  
    const handlePredict = (guess: string) => {
      setPrediction(guess);
      setTimeout(() => {
        setRevealed(true);
        if (guess === current.result) {
          onSound(`Yes! You are a science star! The ${current.name} will ${current.result.toLowerCase()} because ${current.reason.toLowerCase()}`);
        } else {
          onSound(`Look closely! The ${current.name} actually ${current.result.toLowerCase()}. ${current.reason}`);
        }
      }, 800);
    };
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      const resultSchema = z.object({ name: z.string(), result: z.enum(['Float', 'Sink']), prompt: z.string(), reason: z.string() });
      try {
        const { output } = await ai.generate({
          prompt: `Generate a Nursery 1 Float or Sink example for "${aiTopic}".`,
          output: { schema: resultSchema }
        });
        if (output) {
          setItems(prev => [...prev, output]);
          setIsDrawerOpen(false); setIndex(items.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-flask"></i> AI Sink/Float</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 animate-in slide-in-from-bottom duration-500 min-h-[550px]">
          <h3 className="text-4xl font-black text-indigo-500 mb-8 uppercase tracking-tighter text-center">Float or Sink? ⚓</h3>
          <p className="text-2xl font-bold text-gray-400 mb-10 italic text-center">Will the {current.name} stay on top or go to the bottom?</p>
          
          <div className="w-full max-w-lg aspect-square bg-indigo-50 rounded-[4rem] border-8 border-white shadow-2xl flex items-center justify-center mb-10 relative overflow-hidden">
            {loading ? <div className="w-16 h-16 border-8 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && (
              <img src={imageUrl} className={`w-full h-full object-cover transition-all duration-1000 ${revealed ? 'scale-100' : 'scale-125 blur-md'}`} />
            )}
            {!revealed && !loading && <div className="absolute inset-0 bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center"><i className="fas fa-question text-9xl text-white animate-pulse"></i></div>}
          </div>
  
          {!revealed ? (
            <div className="flex gap-8">
              <button onClick={() => handlePredict('Float')} className="px-12 py-5 bg-blue-400 text-white font-black rounded-3xl shadow-xl hover:scale-110 active:scale-95 transition-all flex flex-col items-center gap-2 border-4 border-white"><i className="fas fa-sun text-2xl"></i> FLOAT</button>
              <button onClick={() => handlePredict('Sink')} className="px-12 py-5 bg-indigo-700 text-white font-black rounded-3xl shadow-xl hover:scale-110 active:scale-95 transition-all flex flex-col items-center gap-2 border-4 border-white"><i className="fas fa-anchor text-2xl"></i> SINK</button>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in">
               <div className={`px-10 py-4 rounded-full font-black text-white text-2xl mb-6 shadow-xl ${prediction === current.result ? 'bg-green-500' : 'bg-orange-500'}`}>
                  {prediction === current.result ? 'YOU GUESSED IT!' : 'WATCH OUT!'}
               </div>
               <p className="text-xl font-bold text-indigo-600 italic mb-8">"{current.reason}"</p>
               <button onClick={() => setIndex(p => (p + 1) % items.length)} className="px-12 py-5 bg-indigo-500 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest">Try Another! 🚀</button>
            </div>
          )}
        </div>
        {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-indigo-50"><h3 className="text-3xl font-black text-indigo-600 mb-6">AI Lab Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Object to test</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Feather, Toy Ship" className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-indigo-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'ADD TO EXPERIMENT'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
      </div>
    );
  };
  
const LivingNeeds: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [data, setData] = useState(SCIENCE_DATA.livingNeeds);
    const [index, setIndex] = useState(0);
    const [hasNeed, setHasNeed] = useState(false);
    const [images, setImages] = useState<{ before: string | null; after: string | null }>({ before: null, after: null });
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    useEffect(() => { fetchImages(); setHasNeed(false); }, [index, data]);
    const fetchImages = async () => { setLoading(true); const [b, a] = await Promise.all([generateLessonImage(current.before), generateLessonImage(current.after)]); setImages({ before: b, after: a }); setLoading(false); };
  
    const handleGiveNeed = () => {
      setHasNeed(true);
      onSound(`Wonderful! You gave the ${current.name} some ${current.need.toLowerCase()}! ${current.instruction}`);
    };
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      const resultSchema = z.object({ name: z.string(), need: z.enum(['Water', 'Food', 'Air']), before: z.string(), after: z.string(), instruction: z.string() });
      try {
        const { output } = await ai.generate({
          prompt: `Generate a Nursery 1 Living Need lesson for "${aiTopic}".`,
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
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-heart-pulse"></i> AI Care Assistant</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 animate-in fade-in duration-500 min-h-[550px]">
          <h3 className="text-4xl font-black text-emerald-500 mb-8 uppercase tracking-tighter text-center">What Living Things Need 🌱</h3>
          <p className="text-2xl font-bold text-gray-400 mb-10 italic text-center">The {current.name} is thirsty! Can you help?</p>
          
          <div className="w-full max-w-lg aspect-square bg-emerald-50 rounded-[4rem] border-8 border-white shadow-2xl flex items-center justify-center mb-10 relative overflow-hidden group">
            {loading ? <div className="w-16 h-16 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin"></div> : (
              <img src={(hasNeed ? images.after : images.before) || ''} className="w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-105" />
            )}
          </div>
  
          {!hasNeed ? (
            <button onClick={handleGiveNeed} disabled={loading} className="px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 border-4 border-white uppercase tracking-widest">
              Give {current.need}! <i className={`fas ${current.need === 'Water' ? 'fa-droplet' : 'fa-utensils'}`}></i>
            </button>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in">
               <div className="px-10 py-4 bg-green-500 rounded-full font-black text-white text-2xl mb-6 shadow-xl">
                  THANK YOU! ❤️
               </div>
               <p className="text-xl font-bold text-emerald-600 italic mb-8 max-w-md text-center">"{current.instruction}"</p>
               <button onClick={() => setIndex(p => (p + 1) % data.length)} className="px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest">Next Friend 🐾</button>
            </div>
          )}
        </div>
        {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6">AI Care Lesson</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Thing to care for</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Dog, Flower, Bird" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE CARE SCENE'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
      </div>
    );
};

const BalancedDiet: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [foods, setFoods] = useState(SCIENCE_DATA.diet);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
  
    const current = foods[index];
    useEffect(() => { fetchVisual(); }, [index, foods]);
    const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
    const handleLearn = () => onSound(`A ${current.name} is a ${current.type}! It is a ${current.group.toLowerCase()} food choice.`);
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      const resultSchema = z.object({ name: z.string(), group: z.enum(['Healthy', 'Treat']), type: z.string(), prompt: z.string() });
      try {
        const { output } = await ai.generate({
          prompt: `Generate a Nursery 1 Diet example for "${aiTopic}".`,
          output: { schema: resultSchema }
        });
        if (output) {
          setFoods(prev => [...prev, output]);
          setIsDrawerOpen(false); setIndex(foods.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-yellow-200 text-yellow-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-plus"></i> Add Food</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h3 className="text-4xl font-black text-yellow-500 mb-8 uppercase tracking-tighter">Healthy Plate 🥗</h3>
          <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar w-full justify-center">
             {foods.map((f, i) => (<button key={i} onClick={() => setIndex(i)} className={`px-6 py-2 rounded-2xl font-black transition-all ${index === i ? 'bg-yellow-500 text-white scale-110 shadow-lg' : 'bg-yellow-50 text-yellow-400'}`}>{f.name}</button>))}
          </div>
          <div onClick={handleLearn} className="w-64 h-64 md:w-80 md:h-80 bg-yellow-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center mb-10 relative overflow-hidden group cursor-pointer">
            {loading ? <div className="w-16 h-16 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />}
            <div className="absolute top-4 right-4"><span className={`px-4 py-1 rounded-full font-black text-xs uppercase shadow-md ${current.group === 'Healthy' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>{current.group}</span></div>
          </div>
          <div className="bg-yellow-50 p-8 rounded-[3rem] border-4 border-dashed border-yellow-200 text-center"><h4 className="text-3xl font-black text-yellow-600 mb-2 uppercase">{current.name}</h4><p className="text-xl font-bold text-yellow-800 italic">"I am a {current.type}!"</p></div>
        </div>
        {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-yellow-50"><h3 className="text-3xl font-black text-yellow-600 mb-6">Diet AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Food Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Broccoli" className="w-full px-6 py-4 rounded-2xl border-2 border-yellow-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-yellow-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'ADD FOOD MAGICALLY'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
      </div>
    );
};

const DentistVisit: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [tasks, setTasks] = useState(SCIENCE_DATA.dentist);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
  
    const current = tasks[index];
    useEffect(() => { fetchVisual(); }, [index, tasks]);
    const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
    const handleLearn = () => onSound(current.instruction);
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      const resultSchema = z.object({ task: z.string(), instruction: z.string(), icon: z.string(), prompt: z.string() });
      try {
        const { output } = await ai.generate({
          prompt: `Generate a Nursery 1 Dentist visit step for "${aiTopic}".`,
          output: { schema: resultSchema }
        });
        if (output) {
          setTasks(prev => [...prev, output]);
          setIsDrawerOpen(false); setIndex(tasks.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-plus"></i> Add Tool</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h3 className="text-4xl font-black text-emerald-500 mb-8 uppercase tracking-tighter text-center">My Shiny Teeth 🦷</h3>
          <div className="flex gap-4 mb-10 flex-wrap justify-center">
             {tasks.map((t, i) => (<button key={i} onClick={() => setIndex(i)} className={`w-20 h-20 rounded-2xl flex items-center justify-center border-4 transition-all shadow-lg ${index === i ? 'bg-emerald-500 text-white border-white scale-110' : 'bg-emerald-50 text-emerald-400 border-emerald-100'}`}><i className={`fas ${t.icon} text-3xl`}></i></button>))}
          </div>
          <div onClick={handleLearn} className="w-full max-lg aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <div className="w-16 h-16 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
          </div>
          <div className="bg-emerald-50 p-8 rounded-3xl border-4 border-dashed border-emerald-200 text-2xl font-bold text-emerald-800 text-center italic">"{current.instruction}"</div>
        </div>
        {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6">Dentist AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Dentist Tool/Task</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Flossing" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'ADD TOOL MAGICALLY'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
      </div>
    );
};
  
const HealthCare: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [scenarios, setScenarios] = useState(SCIENCE_DATA.health);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
  
    const current = scenarios[index];
    useEffect(() => { fetchVisual(); }, [index, scenarios]);
    const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
    const handleLearn = () => onSound(`When I am ${current.state.toLowerCase()}, ${current.feeling} I should ${current.care.toLowerCase()}`);
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      const resultSchema = z.object({ state: z.string(), feeling: z.string(), care: z.string(), prompt: z.string() });
      try {
        const { output } = await ai.generate({
          prompt: `Generate a Nursery 1 Health scenario for "${aiTopic}".`,
          output: { schema: resultSchema }
        });
        if (output) {
          setScenarios(prev => [...prev, output]);
          setIsDrawerOpen(false); setIndex(scenarios.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-plus"></i> Add Scenario</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h3 className="text-4xl font-black text-indigo-500 mb-12 uppercase tracking-tighter">Taking Care! 🌡️</h3>
          <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar w-full justify-center">
             {scenarios.map((s, i) => (<button key={i} onClick={() => setIndex(i)} className={`px-8 py-3 rounded-2xl font-black transition-all ${index === i ? 'bg-indigo-500 text-white scale-110 shadow-lg' : 'bg-indigo-50 text-indigo-400'}`}>{s.state}</button>))}
          </div>
          <div onClick={handleLearn} className="w-full max-w-lg aspect-square bg-indigo-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group mb-10 relative">
            {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"><i className="fas fa-heart text-4xl text-indigo-400"></i></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover animate-in zoom-in" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
             <div className="bg-orange-50 p-6 rounded-3xl border-4 border-white shadow-md text-center"><p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Feeling</p><p className="text-xl font-bold text-orange-800 italic">"{current.feeling}"</p></div>
             <div className="bg-green-50 p-6 rounded-3xl border-4 border-white shadow-md text-center"><p className="text-xs font-black text-green-400 uppercase tracking-widest mb-1">Action</p><p className="text-xl font-bold text-green-800 italic">"{current.care}"</p></div>
          </div>
        </div>
        {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-indigo-50"><h3 className="text-3xl font-black text-indigo-600 mb-6">Health AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Health Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Scraped Knee, Flu" className="w-full px-6 py-4 rounded-2xl border-2 border-indigo-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-indigo-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE HEALTH TIP'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
      </div>
    );
};
  
const LivingSorting: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [answered, setAnswered] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
  
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<'living' | 'non-living'>('living');
    const [newPrompt, setNewPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
  
    useEffect(() => {
      const all = [
        ...SCIENCE_DATA.living.map(i => ({ ...i, type: 'living' })),
        ...SCIENCE_DATA.nonLiving.map(i => ({ ...i, type: 'non-living' }))
      ].sort(() => Math.random() - 0.5);
      setItems(all);
      setLoading(false);
    }, []);
  
    useEffect(() => {
      if (items.length > 0) fetchImage();
    }, [currentIndex, items]);
  
    const fetchImage = async () => {
      setLoading(true);
      const url = await generateLessonImage(items[currentIndex].prompt);
      setImageUrl(url);
      setLoading(false);
    };
  
    const handleChoice = (isLiving: boolean) => {
      if (answered) return;
      const correctType = items[currentIndex].type === 'living';
      const isCorrect = isLiving === correctType;
      setAnswered(true);
      if (isCorrect) {
        setFeedback('Yes! You got it!');
        onSound(`That's right! The ${items[currentIndex].name} is a ${items[currentIndex].type} thing! It ${correctType ? 'grows and needs food' : 'does not grow'}.`);
      } else {
        setFeedback('Oops! Try again!');
        onSound(`Not quite! A ${items[currentIndex].name} is actually ${items[currentIndex].type}.`);
        setTimeout(() => setAnswered(false), 2000);
      }
    };
  
    const next = () => {
      setAnswered(false);
      setFeedback('');
      setCurrentIndex((prev) => (prev + 1) % items.length);
    };
  
    const handleMagicPrompt = () => {
      if (!newName) return;
      setIsGenerating(true);
      const prompt = `A cute friendly cartoon ${newName}, nursery style, bright colors, high quality, white background`;
      setNewPrompt(prompt);
      setTimeout(() => setIsGenerating(false), 800);
    };
  
    const handleAddItem = (e: React.FormEvent) => {
      e.preventDefault(); if (!newName || !newPrompt) return;
      const newItem = {
        name: newName.charAt(0).toUpperCase() + newName.slice(1),
        type: newType,
        prompt: newPrompt
      };
      setItems(prev => [newItem, ...prev]);
      setNewName(''); setNewPrompt(''); setIsAdminOpen(false); setCurrentIndex(0);
      onSound(`Magic! We added ${newItem.name} to our science lab!`);
    };
  
    if (items.length === 0) return null;
  
    return (
      <div className="relative">
        <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-500 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-green-50 transition-colors flex items-center gap-2 z-10"><i className="fas fa-folder-plus"></i> Teacher's Drawer</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-100 flex flex-col items-center animate-in fade-in duration-500">
          <h3 className="text-3xl font-black text-green-500 mb-8 uppercase tracking-tight">Is it Living or Non-Living?</h3>
          <div className="w-72 h-72 md:w-96 md:h-96 bg-green-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-12 relative overflow-hidden">{loading ? <div className="w-16 h-16 border-8 border-green-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && (<img src={imageUrl} alt="Subject" className="w-full h-full object-cover p-6 drop-shadow-lg" />)}</div>
          <div className="flex gap-8 mb-8">
            <button onClick={() => handleChoice(true)} disabled={answered} className={`px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-xl flex flex-col items-center gap-2 ${answered && items[currentIndex].type === 'living' ? 'bg-green-500 text-white scale-110' : 'bg-white text-green-500 border-4 border-green-100 hover:bg-green-50'}`}><i className="fas fa-heart"></i> LIVING</button>
            <button onClick={() => handleChoice(false)} disabled={answered} className={`px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-xl flex flex-col items-center gap-2 ${answered && items[currentIndex].type === 'non-living' ? 'bg-red-500 text-white scale-110' : 'bg-white text-red-500 border-4 border-red-100 hover:bg-red-50'}`}><i className="fas fa-ghost"></i> NON-LIVING</button>
          </div>
          {feedback && (<div className="text-2xl font-black text-green-600 animate-bounce mb-8">{feedback}</div>)}
          {answered && (<button onClick={next} className="px-10 py-4 bg-green-500 text-white font-black rounded-2xl shadow-lg hover:bg-green-600 transition-all">NEXT ONE <i className="fas fa-arrow-right"></i></button>)}
        </div>
        {isAdminOpen && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-gray-800 tracking-tight">Add Science Object</h3><button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"><i className="fas fa-times"></i></button></div><form onSubmit={handleAddItem} className="space-y-4"><div className="relative"><label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-widest">Object Name</label><div className="flex gap-2"><input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mushroom" className="flex-grow px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-lg font-bold" /><button type="button" onClick={handleMagicPrompt} disabled={!newName || isGenerating} className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50">{isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}</button></div></div><div><label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-widest">Is it living?</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setNewType('living')} className={`py-3 rounded-2xl font-bold border-2 transition-all ${newType === 'living' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-100'}`}>Living</button><button type="button" onClick={() => setNewType('non-living')} className={`py-3 rounded-2xl font-bold border-2 transition-all ${newType === 'non-living' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-400 border-gray-100'}`}>Non-Living</button></div></div><div><label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-widest">Image Prompt</label><textarea required value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-sm font-medium h-24 resize-none" /></div><button type="submit" className="w-full py-5 bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl">Add to Science Game! 🚀</button></form></div></div>)}
      </div>
    );
};
  
const WeatherWindow: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [weatherList, setWeatherList] = useState(SCIENCE_DATA.weather);
    const [currentIndex, setCurrentIndex] = useState(0);
    const weatherType = weatherList[currentIndex];
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPrompt, setNewPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
  
    useEffect(() => { fetchImage(); }, [weatherType]);
  
    const fetchImage = async () => {
      setLoading(true);
      const url = await generateLessonImage(weatherType.prompt);
      setImageUrl(url);
      setLoading(false);
    };
  
    const handleWeatherChange = (idx: number) => {
      setCurrentIndex(idx);
      onSound(`Look! Now it is ${weatherList[idx].type.toLowerCase()}! What can you see in the window?`);
    };
  
    const handleMagicPrompt = () => {
      if (!newName) return;
      setIsGenerating(true);
      setNewPrompt(`A ${newName.toLowerCase()} day viewed through a cozy nursery window, clouds and bright atmosphere, cartoon nursery style, high quality`);
      setTimeout(() => setIsGenerating(false), 800);
    };
  
    const handleAddWeather = (e: React.FormEvent) => {
      e.preventDefault();
      const newItem = { type: newName, prompt: newPrompt };
      setWeatherList(prev => [...prev, newItem]);
      setNewName(''); setNewPrompt(''); setIsAdminOpen(false); setCurrentIndex(weatherList.length);
      onSound(`Wow! We added ${newName} weather to the window!`);
    };
  
    return (
      <div className="relative">
        <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-500 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-2 z-10"><i className="fas fa-cloud-plus"></i> Teacher's Drawer</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px]">
          <h3 className="text-3xl font-black text-blue-500 mb-8 uppercase tracking-tight">Weather Window</h3>
          <div className="relative w-full max-w-2xl aspect-video rounded-[3rem] border-8 border-blue-50 shadow-2xl overflow-hidden bg-blue-900 group">
            {loading ? (<div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>) : imageUrl && (<img src={imageUrl} alt="Weather View" className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />)}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-6 py-2 rounded-full font-black text-blue-600 shadow-lg">{weatherType.type}</div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {weatherList.map((w, idx) => (<button key={idx} onClick={() => handleWeatherChange(idx)} className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg ${currentIndex === idx ? 'bg-blue-500 text-white scale-110' : 'bg-white text-blue-400 border-4 border-blue-100 hover:bg-blue-50'}`}>{w.type}</button>))}
          </div>
        </div>
        {isAdminOpen && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-gray-800 tracking-tight">Add New Weather</h3><button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"><i className="fas fa-times"></i></button></div><form onSubmit={handleAddWeather} className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Weather Name</label><div className="flex gap-2"><input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Rainbow" className="flex-grow px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-300 focus:outline-none text-lg font-bold" /><button type="button" onClick={handleMagicPrompt} disabled={!newName || isGenerating} className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-200 disabled:opacity-50">{isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}</button></div></div><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Window Scene Prompt</label><textarea required value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-blue-300 focus:border-blue-300 focus:outline-none text-sm font-medium h-24 resize-none" /></div><button type="submit" className="w-full py-5 bg-blue-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-blue-600 transition-all">Create Weather! 🌈</button></form></div></div>)}
      </div>
    );
};
  
export default ScienceExploration;

```