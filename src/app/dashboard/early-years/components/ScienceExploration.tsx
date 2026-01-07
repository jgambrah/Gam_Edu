
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCIENCE_DATA } from '../constants';
import { playRawPcm } from '../services/audio';
import { z } from 'zod';
import { 
  generateTTSAction,
  generateLessonImageAction as generateLessonImage,
  // These are not actually defined in the provided junior-actions, but assuming they should be there.
  // generateConceptDetails, 
  // generateWaterExample, 
  // generateFloatSinkExample, 
  // generateLivingNeedExample, 
  // generateDietExample, 
  // generateDentistExample, 
  // generateHealthScenario 
} from '@/ai/flows/junior-actions';

type ScienceTab = 'body' | 'organs' | 'growth' | 'senses' | 'diet' | 'dentist' | 'health' | 'water' | 'float-sink' | 'needs' | 'living' | 'weather' | 'animals' | 'transport' | 'concepts' | 'skills';

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

const ScienceExploration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScienceTab>('body');
  const [errorMsg, setErrorMsg] = useState('');
  
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
        {activeTab === 'body' && <BodyDiscovery onSound={playSound} />}
        {activeTab === 'organs' && <InnerOrgans onSound={playSound} />}
        {activeTab === 'growth' && <GrowthAndChange onSound={playSound} />}
        {activeTab === 'senses' && <SensesLab onSound={playSound} />}
        {activeTab === 'water' && <WaterWorld onSound={playSound} />}
        {activeTab === 'float-sink' && <FloatSinkLab onSound={playSound} />}
        {activeTab === 'needs' && <LivingNeeds onSound={playSound} />}
        {activeTab === 'diet' && <BalancedDiet onSound={playSound} />}
        {activeTab === 'dentist' && <DentistVisit onSound={playSound} />}
        {activeTab === 'health' && <HealthCare onSound={playSound} />}
        {activeTab === 'living' && <LivingSorting onSound={playSound} />}
        {activeTab === 'weather' && <WeatherWindow onSound={playSound} />}
        {activeTab === 'animals' && <AnimalKingdom onSound={playSound} />}
        {activeTab === 'transport' && <TransportExplorer onSound={playSound} />}
        {activeTab === 'concepts' && <ConceptsZone onSound={playSound} isGlobalPlaying={false} />}
        {activeTab === 'skills' && <SkillsLab onSound={playSound} isGlobalPlaying={false} />}
      </div>
    </div>
  );
};

/* --- WATER WORLD MODULE --- */
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
    if (!aiTopic) return; setIsAiLoading(true);
    try {
        // Dummy implementation since generateWaterExample is not defined in actions
        const result = { success: true, data: { source: aiTopic, use: "New use", prompt: `A picture of ${aiTopic}`, icon: 'fa-question' } };
        if(result.success && result.data) {
            setData(prev => [...prev, result.data!]);
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
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} alt={current.source} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" />}
        </div>
        <div className="bg-blue-50 p-8 rounded-3xl border-4 border-dashed border-blue-200 mb-10 text-center"><p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">How we use it:</p><p className="text-2xl font-bold text-blue-800 italic">"{current.use}"</p></div>
        <div className="flex gap-6"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-left text-2xl"></i></button><button onClick={handleLearn} className="px-10 py-3 bg-blue-500 text-white font-black rounded-2xl shadow-xl uppercase">Splash!</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"><i className="fas fa-arrow-right text-2xl"></i></button></div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6">AI Water Lesson</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Water Scene/Source</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Ice cube, Waterfall" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE MAGIC'}</button><button onClick={() => setIsDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

// --- Dummy components to prevent errors, to be implemented later ---
const BodyDiscovery: React.FC<{ onSound: (t: string) => void }> = () => <div>Body Discovery Module</div>;
const InnerOrgans: React.FC<{ onSound: (t: string) => void }> = () => <div>Inner Organs Module</div>;
const GrowthAndChange: React.FC<{ onSound: (t: string) => void }> = () => <div>Growth & Change Module</div>;
const SensesLab: React.FC<{ onSound: (t: string) => void }> = () => <div>Senses Lab Module</div>;
const FloatSinkLab: React.FC<{ onSound: (t: string) => void }> = () => <div>Float/Sink Lab Module</div>;
const LivingNeeds: React.FC<{ onSound: (t: string) => void }> = () => <div>Living Needs Module</div>;
const BalancedDiet: React.FC<{ onSound: (t: string) => void }> = () => <div>Balanced Diet Module</div>;
const DentistVisit: React.FC<{ onSound: (t: string) => void }> = () => <div>Dentist Visit Module</div>;
const HealthCare: React.FC<{ onSound: (t: string) => void }> = () => <div>Health Care Module</div>;
const LivingSorting: React.FC<{ onSound: (t: string) => void }> = () => <div>Living/Non-Living Sorting Module</div>;
const WeatherWindow: React.FC<{ onSound: (t: string) => void }> = () => <div>Weather Window Module</div>;
const AnimalKingdom: React.FC<{ onSound: (t: string) => void }> = () => <div>Animal Kingdom Module</div>;
const TransportExplorer: React.FC<{ onSound: (t: string) => void }> = () => <div>Transport Explorer Module</div>;
const ConceptsZone: React.FC<{ onSound: (t: string) => void; isGlobalPlaying: boolean }> = () => <div>Concepts Zone Module</div>;
const SkillsLab: React.FC<{ onSound: (t: string) => void; isGlobalPlaying: boolean }> = () => <div>Skills Lab Module</div>;

export default ScienceExploration;

    