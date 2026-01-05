
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NUMERACY_DATA, ADDITION_DATA, SUBTRACTION_DATA, NUMBER_WORDS_DATA, TIME_DATA, MEASUREMENT_DATA, TENS_UNITS_DATA, GROUPING_DATA, SEQUENCE_DATA, NUM_COMPARISON_DATA, COUNTING_TASK_DATA, NUMBER_BONDS_DATA, SPATIAL_DATA, MONEY_DATA } from '../constants';
import { playRawPcm } from '../services/audio';
import { z } from 'zod';
import { 
  generateTTSAction,
  generateNumeracyTask,
  generateLessonImageAction as generateLessonImage,
} from '@/ai/flows/junior-actions';

type MathTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one' | 'tracing';

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

const NumeracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MathTab>('numbers');
  const [playing, setPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
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
        {activeTab === 'numbers' && <NumbersMainModule onSound={playSound} />}
        {activeTab === 'counting' && <CountingGame onSound={playSound} />}
        {activeTab === 'sequence' && <NumberSequenceModule onSound={playSound} />}
        {activeTab === 'comparing' && <NumberComparisonModule onSound={playSound} />}
        {activeTab === 'number-words' && <NumberWordsModule onSound={playSound} />}
        {activeTab === 'bonds' && <NumberBondsModule onSound={playSound} />}
        {activeTab === 'addition' && <AdditionModule onSound={playSound} />}
        {activeTab === 'subtraction' && <SubtractionModule onSound={playSound} />}
        {activeTab === 'tens-units' && <TensUnitsModule onSound={playSound} />}
        {activeTab === 'grouping' && <GroupingModule onSound={playSound} />}
        {activeTab === 'time' && <TellingTimeModule onSound={playSound} />}
        {activeTab === 'money' && <MoneyCountingModule onSound={playSound} />}
        {activeTab === 'measurement' && <MeasurementModule onSound={playSound} />}
        {activeTab === 'shapes' && <ShapesModule onSound={playSound} />}
        {activeTab === 'spatial' && <SpatialModule onSound={playSound} />}
        {activeTab === 'comparison' && <ComparisonGame onSound={playSound} />}
        {activeTab === 'patterns' && <PatternGame onSound={playSound} />}
        {activeTab === 'one-to-one' && <OneToOneGame onSound={playSound} />}
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
    try {
      const result = await generateNumeracyTask({task: "spatial", topic: aiTopic});
      if(result.success && result.data) {
        setData(prev => [...prev, result.data!]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10"><i className="fas fa-magic"></i> AI Spatial Assistant</button>
      <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 min-h-[550px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase tracking-tighter text-center">Where is it? 🕵️‍♀️</h3>
        <p className="text-2xl font-bold text-gray-400 mb-10 italic">Where is the <span className="text-blue-500">{current.target}</span>?</p>
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden group">
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} alt={current.target} className="w-full h-full object-cover p-6" />}
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

// --- Dummy components to prevent errors, to be implemented later ---
const NumbersMainModule: React.FC<{onSound: (t: string) => void}> = () => <div>Numbers Module</div>;
const CountingGame: React.FC<{onSound: (t: string) => void}> = () => <div>Counting Game</div>;
const NumberSequenceModule: React.FC<{onSound: (t: string) => void}> = () => <div>Number Sequence Module</div>;
const NumberComparisonModule: React.FC<{onSound: (t: string) => void}> = () => <div>Number Comparison Module</div>;
const NumberWordsModule: React.FC<{onSound: (t: string) => void}> = () => <div>Number Words Module</div>;
const NumberBondsModule: React.FC<{onSound: (t: string) => void}> = () => <div>Number Bonds Module</div>;
const AdditionModule: React.FC<{onSound: (t: string) => void}> = () => <div>Addition Module</div>;
const SubtractionModule: React.FC<{onSound: (t: string) => void}> = () => <div>Subtraction Module</div>;
const TensUnitsModule: React.FC<{onSound: (t: string) => void}> = () => <div>Tens & Units Module</div>;
const GroupingModule: React.FC<{onSound: (t: string) => void}> = () => <div>Grouping Module</div>;
const TellingTimeModule: React.FC<{onSound: (t: string) => void}> = () => <div>Telling Time Module</div>;
const MoneyCountingModule: React.FC<{onSound: (t: string) => void}> = () => <div>Money Counting Module</div>;
const MeasurementModule: React.FC<{onSound: (t: string) => void}> = () => <div>Measurement Module</div>;
const ShapesModule: React.FC<{onSound: (t: string) => void}> = () => <div>Shapes Module</div>;
const ComparisonGame: React.FC<{onSound: (t: string) => void}> = () => <div>Comparison Game</div>;
const PatternGame: React.FC<{onSound: (t: string) => void}> = () => <div>Pattern Game</div>;
const OneToOneGame: React.FC<{onSound: (t: string) => void}> = () => <div>One to One Game</div>;
const NumberMagicPen: React.FC = () => <div>Number Magic Pen</div>;


export default NumeracyZone;
