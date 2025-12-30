
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PHONICS_DATA, VOCABULARY_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, OPPOSITES_DATA, GRAMMAR_DATA, READING_DATA } from '../constants';
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
  evaluateHandwritingAction,
  generateRhymeAction,
  generateSongVideoAction
} from '@/app/dashboard/early-years/actions';
import { playRawPcm } from '../services/audio';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type LiteracyTab = 'alphabet' | 'blends' | 'rhymes' | 'words' | 'missing-letters' | 'building' | 'grammar' | 'reading' | 'sentences' | 'hidden-words' | 'opposites' | 'storytelling' | 'themes' | 'diction' | 'writing' | 'songs';

// PhonicsZone: Teaches letter sounds and recognition.
const PhonicsZone: React.FC = () => {
  const [phonicsList, setPhonicsList] = useState(PHONICS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newLetter, setNewLetter] = useState('');
  const [newWord, setNewWord] = useState('');

  const currentItem = phonicsList[currentIndex];

  useEffect(() => {
    fetchImage();
  }, [currentIndex, phonicsList]);

  const fetchImage = async () => {
    setLoading(true);
    const result = await generateLessonImageAction(currentItem.imagePrompt);
    if(result.success && result.data) setImageUrl(result.data);
    setLoading(false);
  };

  const playSound = async (text: string) => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
    }
    setPlaying(true);
    const result = await generateTTSAction({ text, voice: 'Kore' });
    if (result.success && result.data) {
      const source = await playRawPcm(result.data);
      if (source) {
        currentSourceRef.current = source;
        source.onended = () => {
          setPlaying(false);
          currentSourceRef.current = null;
        };
      } else { setPlaying(false); }
    } else { setPlaying(false); }
  };

  const handleSoundClick = () => {
     const text = `The letter ${currentItem.upper} makes the sound ${currentItem.lower.toLowerCase()}... ${currentItem.lower.toLowerCase()}... ${currentItem.upper} is for ${currentItem.word}. Can you say ${currentItem.word}?`;
     playSound(text);
  }

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
            onClick={handleSoundClick}
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
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-gray-800">Add New Card</h3><button onClick={() => setIsAdminOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button></div>
            <form onSubmit={handleAddNew} className="space-y-6"><div><label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Letter</label><input type="text" maxLength={1} required value={newLetter} onChange={(e) => setNewLetter(e.target.value)} placeholder="e.g. S" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none text-2xl font-bold uppercase text-center"/></div><div><label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Object/Word</label><input type="text" required value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="e.g. Star" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none text-xl font-medium"/></div><p className="text-xs text-gray-400 italic">AI will automatically draw the picture and read the sound for your new card!</p><button type="submit" className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-600 transition-all">Magic Create Card ✨</button></form>
          </div>
        </div>
      )}
    </div>
  );
};

const VocabularyWorld: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [vocabList, setVocabList] = useState(VOCABULARY_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const currentItem = vocabList[currentIndex];

  useEffect(() => {
    fetchImage();
  }, [currentIndex, vocabList]);

  const fetchImage = async () => {
    setLoading(true);
    const result = await generateLessonImageAction(currentItem.imagePrompt);
    if(result.success && result.data) setImageUrl(result.data);
    setLoading(false);
  };
  
  const handleSoundClick = () => {
    onSound(`${currentItem.word}. Can you say ${currentItem.word}?`);
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

        <div className="w-72 h-72 bg-gray-50 rounded-[3rem] overflow-hidden shadow-inner flex items-center justify-center relative mb-8 border-4 border-green-50 group cursor-pointer" onClick={handleSoundClick}>
          {loading ? (<div className="flex flex-col items-center"><div className="w-14 h-14 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-3"></div><p className="text-green-500 font-bold animate-pulse">Drawing...</p></div>) : 
          imageUrl ? (<><img src={imageUrl} alt={currentItem.word} className="w-full h-full object-cover p-6 group-hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"></i></div></>) : 
          (<div className="text-gray-300 flex flex-col items-center"><i className="fas fa-image fa-4x mb-2"></i><p className="text-xs">Finding image...</p></div>)}
        </div>

        <div className="flex gap-6 items-center"><button onClick={() => setCurrentIndex(prev => (prev === 0 ? vocabList.length - 1 : prev - 1))} className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors shadow-md border-2 border-white"><i className="fas fa-arrow-left fa-xl"></i></button><button onClick={handleSoundClick} disabled={playing} className={`w-24 h-24 rounded-full ${playing ? 'bg-green-300' : 'bg-green-500'} text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white`}><i className={`fas ${playing ? 'fa-spinner fa-spin' : 'fa-volume-high'} fa-3x`}></i></button><button onClick={() => setCurrentIndex(prev => (prev === vocabList.length - 1 ? 0 : prev + 1))} className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors shadow-md border-2 border-white"><i className="fas fa-arrow-right fa-xl"></i></button></div>
        
        <div className="mt-8 flex items-center gap-2">
          {vocabList.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-green-500' : 'w-2 bg-green-100'}`}
            ></div>
          ))}
        </div>
      </div>

      {isAdminOpen && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom duration-300"><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-gray-800 tracking-tight">Add New Word</h3><button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"><i className="fas fa-times"></i></button></div><form onSubmit={handleAddNew} className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Word Name</label><input type="text" required value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="e.g. Robot, Apple, Sun" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-xl font-bold placeholder:text-gray-200"/></div><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Category</label><select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-lg font-medium bg-white"><option>Nature</option><option>Home</option><option>Transport</option><option>Animals</option><option>General</option></select></div><div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100"><p className="text-sm text-green-700 font-bold leading-relaxed flex gap-2"><i className="fas fa-magic mt-1"></i>Magic AI will draw a picture and teach the pronunciation automatically!</p></div><button type="submit" className="w-full py-5 bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all">Create Word Card! 🚀</button></form></div></div>)}
    </div>
  );
};

const WritingCanvas: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<PracticeMode>('numbers');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedNumber, setSelectedNumber] = useState('1');
  const [selectedStroke, setSelectedStroke] = useState(STROKES[0].id);
  const [isDrawingTrace, setIsDrawingTrace] = useState(false);
  const [isDrawingFree, setIsDrawingFree] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF9F43');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (mode === 'numbers') setBrushColor('#FF9F43');
    else if (mode === 'letters') setBrushColor('#FF6B6B');
    else setBrushColor('#45AAF2');
    initCanvases();
  }, [selectedLetter, selectedNumber, selectedStroke, mode]);

  const initCanvases = () => {
    setupCanvas(traceCanvasRef.current, true);
    setupCanvas(freeCanvasRef.current, false);
    setShowSuccess(false);
    setFeedbackMessage('');
  };

  const setupCanvas = (canvas: HTMLCanvasElement | null, isTrace: boolean) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = 400;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height / 2;
    const midX = canvas.width / 2;
    
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 2;
    
    ctx.beginPath(); ctx.moveTo(0, midY - 120); ctx.lineTo(canvas.width, midY - 120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, midY + 120); ctx.lineTo(canvas.width, midY + 120); ctx.stroke();
    
    ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(canvas.width, midY); ctx.stroke();
    ctx.setLineDash([]);

    if (isTrace) {
      ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      if (mode === 'letters') {
        ctx.font = '900 350px Fredoka'; ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; ctx.strokeText(selectedLetter, midX, midY + 20);
      } else if (mode === 'numbers') {
        const fontSize = selectedNumber === '10' ? 280 : 350;
        ctx.font = `900 ${fontSize}px Fredoka`; ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; ctx.strokeText(selectedNumber, midX, midY + 20);
      } else {
        ctx.beginPath(); const padding = 100;
        switch (selectedStroke) {
          case 'standing': ctx.moveTo(midX, midY - padding); ctx.lineTo(midX, midY + padding); break;
          case 'sleeping': ctx.moveTo(midX - padding, midY); ctx.lineTo(midX + padding, midY); break;
          case 'slanting': ctx.moveTo(midX - padding, midY - padding); ctx.lineTo(midX + padding, midY + padding); break;
          case 'curve-up': ctx.arc(midX, midY + padding/2, padding, Math.PI, 0); break;
          case 'curve-down': ctx.arc(midX, midY - padding/2, padding, 0, Math.PI); break;
          case 'curve-left': ctx.arc(midX + padding/2, midY, padding, 0.5 * Math.PI, 1.5 * Math.PI); break;
          case 'curve-right': ctx.arc(midX - padding/2, midY, padding, 1.5 * Math.PI, 0.5 * Math.PI); break;
          case 'circle': ctx.arc(midX, midY, padding, 0, Math.PI * 2); break;
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  };

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: any, canvasRef: React.RefObject<HTMLCanvasElement | null>, setDrawing: (v: boolean) => void) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    setDrawing(true); const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 18; ctx.lineCap = 'round';
    ctx.lineJoin = 'round'; ctx.strokeStyle = brushColor;
  };

  const draw = (e: any, canvasRef: React.RefObject<HTMLCanvasElement | null>, isDrawing: boolean) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
  };

  const handleFinish = async () => {
    if (!freeCanvasRef.current) return;
    setIsEvaluating(true);
    setFeedbackMessage('Magic checking...');
    try {
        const dataUrl = freeCanvasRef.current.toDataURL('image/png');
        let target = '';
        if (mode === 'letters') target = `letter ${selectedLetter}`;
        else if (mode === 'numbers') target = `number ${selectedNumber}`;
        else target = STROKES.find(s => s.id === selectedStroke)?.label || 'stroke';
  
        const result = await evaluateHandwritingAction({ imageDataUrl: dataUrl, target });

        if (result.success && result.data) {
            if (result.data.isCorrect) {
              setShowSuccess(true);
              setFeedbackMessage('You are a star!');
              onSound(`Wow! You wrote the ${target} perfectly! You are a writing superstar!`);
              setTimeout(() => setShowSuccess(false), 5000);
            } else {
              setFeedbackMessage('So close! Try once more.');
              onSound(`Almost there! Let's try to trace the ${target} one more time. You can do it!`);
            }
        } else {
            throw new Error(result.error || 'AI check failed');
        }
    } catch (error) {
        console.error(error);
        setFeedbackMessage('The magic is sleeping.');
    } finally {
        setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto space-y-6 relative">
      {showSuccess && (<div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"><div className="bg-white/95 backdrop-blur-xl p-16 rounded-[4rem] shadow-[0_0_100px_rgba(255,159,67,0.3)] border-8 border-orange-400 flex flex-col items-center animate-in zoom-in duration-500"><i className="fas fa-wand-magic-sparkles text-[10rem] text-yellow-400 animate-bounce mb-8"></i><h2 className="text-6xl font-black text-orange-600 mb-4 tracking-tighter uppercase">MAGICAL!</h2><p className="text-2xl font-bold text-orange-400 uppercase tracking-widest">Writing Superstar</p><div className="mt-8 flex gap-4">{[1,2,3,4,5].map(i => <i key={i} className="fas fa-heart text-4xl text-pink-400 animate-pulse" style={{animationDelay: `${i*0.2}s`}}></i>)}</div></div></div>)}
      <div className="flex bg-white p-2 rounded-3xl shadow-xl border-4 border-gray-50 flex-wrap justify-center gap-2">
          <button onClick={() => setMode('numbers')} className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'numbers' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'text-orange-300 hover:bg-orange-50'}`}><i className="fas fa-1-9 mr-2"></i> Numbers 1-10</button>
          <button onClick={() => setMode('letters')} className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'letters' ? 'bg-pink-500 text-white shadow-lg scale-105' : 'text-pink-300 hover:bg-pink-50'}`}><i className="fas fa-font mr-2"></i> Letters A-Z</button>
          <button onClick={() => setMode('strokes')} className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'strokes' ? 'bg-blue-500 text-white shadow-lg scale-105' : 'text-blue-300 hover:bg-blue-50'}`}><i className="fas fa-lines-leaning mr-2"></i> Strokes</button>
      </div>
      <div className={`w-full bg-white p-4 rounded-[2.5rem] shadow-xl border-4 transition-colors duration-500 ${mode === 'letters' ? 'border-pink-100' : mode === 'numbers' ? 'border-orange-100' : 'border-blue-100'}`}>
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar px-4">
          {mode === 'letters' ? (LETTERS.map(l => (<button key={l} onClick={() => setSelectedLetter(l)} className={`flex-shrink-0 w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all ${selectedLetter === l ? 'bg-pink-500 text-white scale-110 shadow-lg' : 'bg-pink-50 text-pink-300 hover:bg-pink-100'}`}>{l}</button>))) : 
          mode === 'numbers' ? (NUMBERS.map(n => (<button key={n} onClick={() => setSelectedNumber(n)} className={`flex-shrink-0 w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all ${selectedNumber === n ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}`}>{n}</button>))) : 
          (STROKES.map(s => (<button key={s.id} onClick={() => setSelectedStroke(s.id)} className={`flex-shrink-0 px-6 h-16 rounded-2xl font-black flex items-center gap-3 transition-all ${selectedStroke === s.id ? 'bg-blue-500 text-white scale-105 shadow-lg' : 'bg-blue-50 text-blue-300 hover:bg-blue-100'}`}><i className={`fas ${s.icon} text-2xl`}></i><span className="whitespace-nowrap uppercase text-[10px] tracking-widest">{s.label}</span></button>)))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-4 group"><div className="flex items-center justify-between px-6"><h3 className={`text-2xl font-black flex items-center gap-3 uppercase tracking-tighter transition-colors ${mode === 'letters' ? 'text-pink-500' : mode === 'numbers' ? 'text-orange-500' : 'text-blue-500'}`}><span className={`w-10 h-10 ${mode === 'letters' ? 'bg-pink-500' : mode === 'numbers' ? 'bg-orange-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center text-lg shadow-md`}>1</span>Trace the Guide</h3></div><div className={`relative bg-white border-8 ${mode === 'letters' ? 'border-pink-50' : mode === 'numbers' ? 'border-orange-50' : 'border-blue-50'} rounded-[3.5rem] shadow-2xl overflow-hidden cursor-crosshair h-[400px] transition-all group-hover:border-white`}><canvas ref={traceCanvasRef} onMouseDown={(e) => startDrawing(e, traceCanvasRef, setIsDrawingTrace)} onMouseMove={(e) => draw(e, traceCanvasRef, isDrawingTrace)} onMouseUp={() => setIsDrawingTrace(false)} onMouseLeave={() => setIsDrawingTrace(false)} onTouchStart={(e) => startDrawing(e, traceCanvasRef, setIsDrawingTrace)} onTouchMove={(e) => draw(e, traceCanvasRef, isDrawingTrace)} onTouchEnd={() => setIsDrawingTrace(false)} className="w-full h-full"/></div></div>
        <div className="flex flex-col gap-4 relative group"><div className="flex items-center justify-between px-6"><h3 className={`text-2xl font-black flex items-center gap-3 uppercase tracking-tighter transition-colors ${mode === 'letters' ? 'text-blue-500' : mode === 'numbers' ? 'text-pink-500' : 'text-orange-500'}`}><span className={`w-10 h-10 ${mode === 'letters' ? 'bg-blue-500' : mode === 'numbers' ? 'bg-pink-500' : 'bg-orange-500'} text-white rounded-full flex items-center justify-center text-lg shadow-md`}>2</span>Draw Your Own!</h3></div><div className={`relative bg-white border-8 ${mode === 'letters' ? 'border-blue-50' : mode === 'numbers' ? 'border-pink-50' : 'border-orange-50'} rounded-[3.5rem] shadow-2xl overflow-hidden cursor-crosshair h-[400px] transition-all group-hover:border-white`}><canvas ref={freeCanvasRef} onMouseDown={(e) => startDrawing(e, freeCanvasRef, setIsDrawingFree)} onMouseMove={(e) => draw(e, freeCanvasRef, isDrawingFree)} onMouseUp={() => setIsDrawingFree(false)} onMouseLeave={() => setIsDrawingFree(false)} onTouchStart={(e) => startDrawing(e, freeCanvasRef, setIsDrawingFree)} onTouchMove={(e) => draw(e, freeCanvasRef, isDrawingFree)} onTouchEnd={() => setIsDrawingFree(false)} className="w-full h-full"/>{isEvaluating && (<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_#60a5fa] z-10 animate-[scan_1.5s_ease-in-out_infinite]"></div>)}</div><style>{`@keyframes scan { 0% { top: 10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 90%; opacity: 0; } }`}</style></div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white px-12 py-7 rounded-[3rem] shadow-2xl border-4 border-gray-50 max-w-full"><div className="flex gap-3">{['#FF6B6B', '#FF9F43', '#FFE66D', '#4ECDC4', '#45AAF2', '#A55EEA', '#202020'].map(color => (<button key={color} onClick={() => setBrushColor(color)} style={{ backgroundColor: color }} className={`w-11 h-11 rounded-full border-4 transition-all ${brushColor === color ? 'border-gray-800 scale-125 shadow-lg' : 'border-white hover:scale-110'}`}/>))}</div><div className="h-10 w-px bg-gray-200 hidden sm:block" /><div className="flex gap-4"><button onClick={clearAll} className="px-8 py-3 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-2 uppercase text-xs tracking-widest border border-gray-100"><i className="fas fa-trash-can"></i> Start Over</button><button onClick={handleFinish} disabled={isEvaluating} className={`px-12 py-3 ${isEvaluating ? 'bg-gray-400' : 'bg-green-500'} text-white font-black rounded-2xl shadow-[0_6px_0_0_#15803d] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-3 uppercase text-sm tracking-widest`}>{isEvaluating ? (<><i className="fas fa-wand-sparkles fa-spin"></i> Magical Check...</>) : (<><i className="fas fa-check-double"></i> Check My Work!</>)}</button></div></div>
      {feedbackMessage && !showSuccess && (<div className="px-10 py-4 bg-white text-orange-600 rounded-full font-black animate-bounce shadow-lg border-4 border-orange-50 uppercase text-xs tracking-widest flex items-center gap-3"><i className="fas fa-magic"></i> {feedbackMessage}</div>)}
    </div>
  );
};

const SongBox: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [rhyme, setRhyme] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
  
    const handleCreateSong = async (selectedTopic?: string) => {
      const finalTopic = selectedTopic || topic;
      if (!finalTopic) return;
  
      setIsLoading(true); setVideoUrl(null); setRhyme('');
      
      try {
        setStatus('Writing the magical words...');
        const rhymeResult = await generateRhymeAction(finalTopic);
        if(!rhymeResult.success || !rhymeResult.data) throw new Error("Failed to get rhyme.");
        setRhyme(rhymeResult.data);
  
        setStatus('Painting the musical movie (this takes a minute!)...');
        const videoResult = await generateSongVideoAction(finalTopic);
        if(!videoResult.success || !videoResult.data) throw new Error("Failed to create video.");
        setVideoUrl(videoResult.data);
  
        setStatus('Ready to sing!');
      } catch (error) {
        console.error(error); setStatus('Oops! The magic is stuck. Try again!');
      } finally {
        setIsLoading(false);
      }
    };
  
    const playSong = async () => {
      if (!rhyme || !videoUrl) return;
      setIsPlaying(true);
      if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); }
  
      const result = await generateTTSAction({ text: rhyme, voice: 'Puck' });
      if (result.success && result.data) {
        const source = await playRawPcm(result.data);
        if (source) {
          source.onended = () => { setIsPlaying(false); if (videoRef.current) videoRef.current.pause(); };
        } else { setIsPlaying(false); }
      } else { setIsPlaying(false); }
    };
  
    return (
      <div className="flex flex-col items-center p-6 bg-yellow-50 rounded-[3rem] shadow-2xl border-8 border-yellow-100 min-h-[600px]">
        <div className="text-center mb-8"><h2 className="text-4xl font-extrabold text-yellow-600 mb-2">Magic Song Maker 🎶</h2><p className="text-gray-500 font-medium">Pick a topic and AI will write & sing a song for you!</p></div>
        {!videoUrl && !isLoading && (
          <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{PRESET_TOPICS.map((t) => (<button key={t.label} onClick={() => handleCreateSong(t.label)} className={`${t.color} p-6 rounded-3xl text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-3`}><i className={`fas ${t.icon} text-3xl`}></i><span className="font-bold text-sm">{t.label}</span></button>))}</div>
            <div className="bg-white p-6 rounded-[2rem] shadow-inner border-4 border-yellow-200"><p className="text-sm font-bold text-yellow-600 mb-3 uppercase tracking-wider">Or type anything!</p><div className="flex gap-2"><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Red Robots or Flying Cats" className="flex-grow px-6 py-4 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-400 text-lg font-medium"/><button onClick={() => handleCreateSong()} className="bg-yellow-500 text-white px-8 py-4 rounded-2xl font-bold shadow-md hover:bg-yellow-600 transition-colors">Go!</button></div></div>
          </div>
        )}
        {isLoading && (<div className="flex flex-col items-center justify-center p-12 space-y-6"><div className="relative"><div className="w-24 h-24 border-8 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center text-yellow-500"><i className="fas fa-music fa-2xl"></i></div></div><div className="text-center"><p className="text-2xl font-bold text-yellow-700 mb-2">{status}</p><p className="text-gray-400 animate-pulse">Our AI musicians are hard at work...</p></div></div>)}
        {videoUrl && !isLoading && (
          <div className="w-full max-w-3xl space-y-6 animate-in zoom-in duration-500">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-black aspect-video"><video ref={videoRef} src={videoUrl} loop className="w-full h-full object-cover" playsInline/>{!isPlaying && (<div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"><button onClick={playSong} className="w-24 h-24 bg-yellow-400 text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"><i className="fas fa-play text-4xl ml-2"></i></button></div>)}</div>
            <div className="bg-white p-8 rounded-[2rem] shadow-lg border-4 border-yellow-100 text-center italic"><h3 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-widest">Rhyme Lyrics</h3><p className="text-2xl font-bold text-gray-700 whitespace-pre-line leading-relaxed">{rhyme}</p></div>
            <div className="flex justify-center gap-4"><button onClick={() => { setVideoUrl(null); setRhyme(''); }} className="px-8 py-4 bg-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-300 transition-colors">New Song</button><button onClick={playSong} disabled={isPlaying} className="px-10 py-4 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-colors"><i className="fas fa-redo mr-2"></i> Sing Again</button></div>
          </div>
        )}
        <div className="mt-auto pt-8"><p className="text-xs text-yellow-800/40 text-center max-w-md">Note: Video generation uses advanced AI models. Please ensure you have selected a valid paid project API key from <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Google AI Studio</a>.</p></div>
      </div>
    );
};

const LiteracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LiteracyTab>('alphabet');

  const handleSound = useCallback(async (text: string) => {
    try {
      const result = await generateTTSAction({ text, voice: 'Kore' });
      if (result.success && result.data) {
        await playRawPcm(result.data);
      }
    } catch (e) { console.error("TTS failed:", e); }
  }, []);

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
        {activeTab === 'alphabet' && <PhonicsZone />}
        {activeTab === 'words' && <VocabularyWorld onSound={handleSound} />}
        {activeTab === 'writing' && <WritingCanvas onSound={handleSound} />}
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
        {activeTab === 'songs' && <SongBox />}
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


export default LiteracyZone;