
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ARTS_DATA } from '../constants';
import { playRawPcm } from '../services/audio';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { 
    generateTTSAction, 
    generateArtDetailsAction,
    generateLessonImageAction
} from '../actions';


type ArtsTab = 'studio' | 'colors' | 'shapes' | 'texture';

const ArtsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ArtsTab>('studio');
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
      const result = await generateTTSAction({text, voice: 'Kore'});
      if (result.success && result.data) {
        const source = await playRawPcm(result.data);
        if (source) {
          currentSourceRef.current = source;
          source.onended = () => { setPlaying(false); currentSourceRef.current = null; };
        } else { setPlaying(false); }
      } else { 
          setPlaying(false); 
          throw new Error(result.error);
      }
    } catch (err: any) {
      setPlaying(false);
       setErrorMsg('Tutor is resting! Check your API key.');
    }
  }, []);

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-5xl font-black text-pink-500 uppercase tracking-tighter">Arts Hub 🎨</h2>
        <p className="text-gray-400 font-bold italic">Let's make something beautiful!</p>
      </div>

      {errorMsg && (
        <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-2xl font-bold text-sm animate-bounce">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-3xl shadow-xl border-4 border-pink-50">
        {(['studio', 'colors', 'shapes', 'texture'] as ArtsTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-pink-500 text-white shadow-lg' : 'text-pink-300 hover:bg-pink-50'
            }`}
          >
            {tab === 'studio' ? 'Creative Studio' : tab === 'colors' ? 'Color Garden' : tab === 'shapes' ? 'Shape World' : 'Texture Bin'}
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeTab === 'studio' && <CreativeStudio onSound={playFeedbackSound} />}
        {activeTab === 'colors' && <ColorGarden onSound={playFeedbackSound} />}
        {activeTab === 'shapes' && <ShapeWorld onSound={playFeedbackSound} />}
        {activeTab === 'texture' && <TextureBin onSound={playFeedbackSound} />}
      </div>
    </div>
  );
};

const CreativeStudio: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prompts, setPrompts] = useState(ARTS_DATA.drawingPrompts);
  const [promptIndex, setPromptIndex] = useState(0);
  const [inspirationUrl, setInspirationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  useEffect(() => {
    initCanvas();
    fetchInspiration();
  }, [promptIndex]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 400;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const fetchInspiration = async () => {
    setLoading(true);
    const url = await generateLessonImageAction(prompts[promptIndex].prompt);
    setInspirationUrl(url);
    setLoading(false);
  };

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMagicPrompt = () => {
    if (!newName) return;
    setIsMagicLoading(true);
    setNewPrompt(`A friendly, bright, and simple cartoon drawing of ${newName}, nursery style, bold lines, high quality, white background`);
    setTimeout(() => setIsMagicLoading(false), 800);
  };

  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { title: newName, prompt: newPrompt, difficulty: 'Easy' };
    setPrompts(prev => [...prev, newItem]);
    setNewName(''); setNewPrompt(''); setIsAdminOpen(false);
    setPromptIndex(prompts.length);
    onSound(`Yay! New inspiration added: ${newName}!`);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-500 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-pink-50 transition-colors flex items-center gap-2 z-10"><i className="fas fa-sparkles"></i> Teacher's Drawer</button>
      <div className="w-full bg-white p-8 md:p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center animate-in slide-in-from-top duration-500">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-black text-pink-500 uppercase">Today's Prompt: {prompts[promptIndex].title}</h3>
          <p className="text-gray-400 font-bold italic">Grab your brush and start scribbling!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full mb-8">
          <div className="md:col-span-1 flex flex-col gap-4">
             <div className="bg-pink-50 p-6 rounded-[2.5rem] border-4 border-white shadow-lg">
                <p className="text-xs font-black text-pink-400 mb-4 uppercase tracking-widest">Inspiration</p>
                <div className="aspect-square bg-white rounded-3xl overflow-hidden border-2 border-pink-100 flex items-center justify-center">
                  {loading ? <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div> : inspirationUrl && <img src={inspirationUrl} className="w-full h-full object-cover" />}
                </div>
                <button onClick={() => onSound(`Let's draw ${prompts[promptIndex].title}! Use your favorite colors!`)} className="mt-4 w-full py-2 bg-pink-100 text-pink-500 rounded-xl font-bold text-xs"><i className="fas fa-volume-high mr-2"></i> Listen</button>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border-4 border-pink-50 shadow-md">
                <p className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Brushes</p>
                <div className="flex flex-wrap gap-2">
                  {['#FF6B6B', '#4ECDC4', '#FFE66D', '#45AAF2', '#A55EEA', '#202020', '#FFFFFF'].map(c => (
                    <button key={c} onClick={() => setBrushColor(c)} style={{ backgroundColor: c }} className={`w-8 h-8 rounded-full border-2 transition-all ${brushColor === c ? 'scale-125 border-gray-800' : 'border-gray-100'}`}></button>
                  ))}
                </div>
                <input type="range" min="2" max="50" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full mt-6 accent-pink-500" />
             </div>
          </div>

          <div className="md:col-span-3">
             <div className="relative bg-white rounded-[3rem] border-8 border-pink-50 shadow-inner h-[400px] overflow-hidden cursor-crosshair">
                <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full"
                />
             </div>
             <div className="flex gap-4 mt-6">
                <button onClick={() => { const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); } }} className="px-6 py-2 bg-gray-100 text-gray-500 rounded-full font-bold text-xs uppercase"><i className="fas fa-eraser mr-2"></i> Clear Canvas</button>
                <button onClick={() => setPromptIndex(p => (p + 1) % prompts.length)} className="px-6 py-2 bg-pink-500 text-white rounded-full font-bold text-xs uppercase shadow-md"><i className="fas fa-shuffle mr-2"></i> Next Idea</button>
             </div>
          </div>
        </div>
      </div>

      {isAdminOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Add Art Prompt</h3>
              <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddPrompt} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Subject Name</label>
                <div className="flex gap-2">
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Blue Robot" className="flex-grow px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none text-lg font-bold" />
                  <button type="button" onClick={handleMagicPrompt} disabled={!newName || isMagicLoading} className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center hover:bg-pink-200 disabled:opacity-50">{isMagicLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Inspiration Image Prompt</label>
                <textarea required value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none text-sm font-medium h-24 resize-none" />
              </div>
              <button type="submit" className="w-full py-5 bg-pink-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-pink-600 transition-all">Add to Studio! 🎨</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ColorGarden: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [items, setItems] = useState(ARTS_DATA.colorNature);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('Green');
  const [newPrompt, setNewPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { fetchVisual(); }, [index]);

  const fetchVisual = async () => {
    setLoading(true);
    const url = await generateLessonImageAction(items[index].prompt);
    setImageUrl(url);
    setLoading(false);
  };

  const handleMagicPrompt = () => {
    if (!newName) return;
    setIsGenerating(true);
    setNewPrompt(`A beautiful ${newColor.toLowerCase()} ${newName.toLowerCase()} in a natural setting, cartoon nursery style, bright colors, high quality`);
    setTimeout(() => setIsGenerating(false), 800);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { name: newName, color: newColor, prompt: newPrompt };
    setItems(prev => [...prev, newItem]);
    setNewName(''); setNewPrompt(''); setIsAdminOpen(false);
    setIndex(items.length);
    onSound(`Beautiful! A new ${newColor} ${newName} is in the garden!`);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-500 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-green-50 transition-colors flex items-center gap-2 z-10"><i className="fas fa-leaf"></i> Teacher's Drawer</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-100 flex flex-col items-center animate-in slide-in-from-right duration-500 min-h-[600px]">
        <h3 className="text-3xl font-black text-green-600 mb-8 uppercase tracking-tight">Color Nature Discovery</h3>
        <div className="text-center mb-10">
           <span className="px-6 py-2 bg-green-50 text-green-500 rounded-full font-black text-xl uppercase tracking-widest border-2 border-green-100">
             The color {items[index].color}
           </span>
           <p className="text-gray-400 font-bold mt-4 italic">"{items[index].name} is {items[index].color.toLowerCase()}!"</p>
        </div>
        <div onClick={() => onSound(`Look at the ${items[index].name}! It is so ${items[index].color.toLowerCase()}!`)} className="relative w-80 h-80 md:w-96 md:h-96 bg-green-50 rounded-[3.5rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-green-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />}
          <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 drop-shadow-lg"></i></div>
        </div>
        <div className="flex gap-6 mt-12">
           <button onClick={() => setIndex(i => (i === 0 ? items.length - 1 : i - 1))} className="w-14 h-14 bg-green-100 text-green-500 rounded-full flex items-center justify-center hover:bg-green-200 transition-all shadow-md active:scale-90"><i className="fas fa-chevron-left fa-xl"></i></button>
           <button onClick={() => setIndex(i => (i + 1) % items.length)} className="w-14 h-14 bg-green-100 text-green-500 rounded-full flex items-center justify-center hover:bg-green-200 transition-all shadow-md active:scale-90"><i className="fas fa-chevron-right fa-xl"></i></button>
        </div>
      </div>
      {isAdminOpen && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-gray-800 tracking-tight">Add Nature Item</h3><button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button></div><form onSubmit={handleAddItem} className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Object Name</label><div className="flex gap-2"><input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Butterfly" className="flex-grow px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-lg font-bold" /><button type="button" onClick={handleMagicPrompt} disabled={!newName || isGenerating} className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center hover:bg-green-200 disabled:opacity-50">{isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}</button></div></div><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Main Color</label><select value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 bg-white font-bold"><option>Red</option><option>Blue</option><option>Yellow</option><option>Green</option><option>Purple</option><option>Orange</option></select></div><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Image Prompt</label><textarea required value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-sm font-medium h-24 resize-none" /></div><button type="submit" className="w-full py-5 bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-green-600 transition-all">Add to Garden! 🌿</button></form></div></div>)}
    </div>
  );
};

const ShapeWorld: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [challenges, setChallenges] = useState(ARTS_DATA.shapeChallenges);
  const [index, setIndex] = useState(0);
  const current = challenges[index];

  // Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newParts, setNewParts] = useState<string[]>([]);
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const handleMagicFill = async () => {
    if (!newName) return;
    setIsMagicLoading(true);
    const result = await generateArtDetailsAction({ item: newName, type: 'shapes' });
    if (result.success && result.data) {
      setNewDesc(result.data.description);
      setNewParts(result.data.parts);
    }
    setIsMagicLoading(false);
  };

  const handleAddChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { name: newName, description: newDesc, parts: newParts };
    setChallenges(prev => [...prev, newItem]);
    setNewName(''); setNewDesc(''); setNewParts([]); setIsAdminOpen(false);
    setIndex(challenges.length);
    onSound(`Cool! New drawing challenge: ${newName}!`);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-400 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-orange-50 transition-colors flex items-center gap-2 z-10"><i className="fas fa-shapes"></i> Teacher's Drawer</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center animate-in zoom-in duration-500 min-h-[500px]">
        <h3 className="text-3xl font-black text-orange-500 mb-8 uppercase tracking-tight">Shape Builder</h3>
        <div className="text-center max-w-md bg-orange-50 p-8 rounded-[2.5rem] border-4 border-white shadow-lg mb-10">
          <h4 className="text-2xl font-black text-orange-600 mb-4">{current.name}</h4>
          <p className="text-orange-400 font-bold italic mb-6 leading-relaxed">{current.description}</p>
          <div className="flex gap-4 justify-center">
            {current.parts.map((p, i) => (
              <div key={i} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border-4 border-orange-100 text-orange-300 shadow-sm animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                <i className={`fas ${p === 'Circle' ? 'fa-circle' : p === 'Square' ? 'fa-square' : p === 'Triangle' ? 'fa-play rotate-[270deg]' : 'fa-star'} text-4xl`}></i>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onSound(current.description)} className="px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"><i className="fas fa-volume-high"></i> Tell Me Again</button>
          <button onClick={() => setIndex(i => (i + 1) % challenges.length)} className="px-10 py-4 bg-orange-100 text-orange-500 font-black rounded-2xl transition-all flex items-center gap-2">Next Challenge <i className="fas fa-arrow-right"></i></button>
        </div>
      </div>
      {isAdminOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">New Shape Challenge</h3>
              <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddChallenge} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Challenge Title</label>
                <div className="flex gap-2">
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. My Toy Block" className="flex-grow px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-lg font-bold" />
                  <button type="button" onClick={handleMagicFill} disabled={!newName || isMagicLoading} className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center hover:bg-orange-200 disabled:opacity-50">{isMagicLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Instructions</label>
                <textarea required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-sm font-medium h-24 resize-none" />
              </div>
              <button type="submit" className="w-full py-5 bg-orange-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-orange-600 transition-all">Add Challenge! 🎨</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TextureBin: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [textures, setTextures] = useState(ARTS_DATA.textureBin);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  useEffect(() => { fetchTexture(); }, [index]);

  const fetchTexture = async () => {
    setLoading(true);
    const url = await generateLessonImageAction(textures[index].prompt);
    setImageUrl(url);
    setLoading(false);
  };

  const handleMagicFill = async () => {
    if (!newName) return;
    setIsMagicLoading(true);
    const result = await generateArtDetailsAction({ item: newName, type: 'textures' });
    if (result.success && result.data) {
      setNewPrompt(result.data.prompt);
      setNewDesc(result.data.description);
    }
    setIsMagicLoading(false);
  };

  const handleAddTexture = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { name: newName, prompt: newPrompt, description: newDesc };
    setTextures(prev => [...prev, newItem]);
    setNewName(''); setNewPrompt(''); setNewDesc(''); setIsAdminOpen(false);
    setIndex(textures.length);
    onSound(`Sensory alert! We found a new ${newName} texture!`);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsAdminOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-500 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-2 z-10"><i className="fas fa-hand-dots"></i> Teacher's Drawer</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center animate-in slide-in-from-bottom duration-500 min-h-[600px]">
        <h3 className="text-3xl font-black text-blue-500 mb-8 uppercase tracking-tight">Texture Bin</h3>
        <p className="text-gray-400 font-bold mb-10">Look closely! How does this feel?</p>
        <div onClick={() => onSound(textures[index].description)} className="relative w-72 h-72 md:w-96 md:h-96 bg-blue-50 rounded-[4rem] border-8 border-white shadow-inner flex items-center justify-center cursor-pointer group overflow-hidden mb-10">
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} alt={textures[index].name} className="w-full h-full object-cover transition-transform group-hover:scale-125" />}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center">
             <i className="fas fa-magnifying-glass text-white text-5xl opacity-0 group-hover:opacity-100 drop-shadow-lg"></i>
          </div>
        </div>
        <div className="text-center bg-blue-50 px-10 py-6 rounded-[2.5rem] border-4 border-white shadow-lg mb-8">
          <h4 className="text-2xl font-black text-blue-600 mb-2">{textures[index].name}</h4>
        </div>
        <button onClick={() => setIndex(i => (i + 1) % textures.length)} className="px-12 py-4 bg-blue-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-sm">Find Next Texture</button>
      </div>

      {isAdminOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">New Sensory Texture</h3>
              <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddTexture} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Texture Name</label>
                <div className="flex gap-2">
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Rough Sandpaper" className="flex-grow px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-300 focus:outline-none text-lg font-bold" />
                  <button type="button" onClick={handleMagicFill} disabled={!newName || isMagicLoading} className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-200 disabled:opacity-50">{isMagicLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Image Prompt (Macro)</label>
                <textarea required value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-300 focus:outline-none text-sm font-medium h-20 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Spoken Reaction</label>
                <input type="text" required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-300 focus:outline-none text-sm" />
              </div>
              <button type="submit" className="w-full py-5 bg-blue-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-blue-600 transition-all">Add Texture! 🖐️</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ArtsHub;
