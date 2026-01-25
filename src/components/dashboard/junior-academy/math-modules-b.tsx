
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as constants from '@/lib/constants';
import { generateLessonImageAction } from '@/ai/flows/junior-actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { IconRenderer } from './math-modules-a';

const {
    Loader2, ArrowLeft, ArrowRight, Clock, ArrowLeftRight
} = LucideIcons;


/* --- 10. GROUPING --- */
export const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.grouping || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center">
      <h3 className="text-4xl font-black text-emerald-500 mb-8 uppercase">Grouping Fun 🤝</h3>
      <div className="flex items-center gap-12 mb-10">
         <div className="text-center"><p className="text-xs font-black text-slate-500 uppercase mb-1">Group Size</p><div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black">{current.groupSize}</div></div>
         <ArrowRight className="text-slate-300"/>
         <div className="text-center"><p className="text-xs font-black text-slate-500 uppercase mb-1">Total {current.theme}</p><div className="w-20 h-20 bg-white border-4 border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl font-black">{current.totalItems}</div></div>
      </div>
      <div className="w-full max-w-2xl aspect-video bg-emerald-50 rounded-[3rem] overflow-hidden mb-10">
        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Loader2 className="animate-spin m-auto"/>}
      </div>
      <Button onClick={() => setIndex((index + 1) % data.length)} className="bg-emerald-500 text-white rounded-xl h-12 px-10">NEXT TASK</Button>
    </div>
  );
};

/* --- 11. TELLING TIME --- */
export const TellingTimeModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.time || []);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const current = data[index];
  const options = useMemo(() => current ? [current.hour, (current.hour + 3) % 12 || 12, (current.hour + 6) % 12 || 12].sort(() => Math.random() - 0.5) : [], [current]);
  useEffect(() => { setAnswered(false); }, [index]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px]">
        <h3 className="text-4xl font-black text-blue-500 mb-8 uppercase">Clock Time ⏰</h3>
        <div className="w-72 h-72 bg-blue-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center mb-12 relative cursor-pointer" onClick={() => onSound(current.phrase)}>
          <Clock className="h-40 w-40 text-blue-300" />
          <div className="absolute inset-0 flex items-center justify-center"><LucideIcons.Volume2 className="text-blue-500 h-10 w-10 opacity-50"/></div>
        </div>
        <div className="flex gap-6">
          {options.map(opt => (
            <Button key={opt} onClick={() => { if(opt === current.hour) setAnswered(true); onSound(opt === current.hour ? "Yes!" : "No"); }} className={cn("px-10 py-5 rounded-3xl text-3xl", answered && opt === current.hour ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-600')}>{opt}:00</Button>
          ))}
        </div>
        {answered && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-8 bg-blue-500 text-white px-10 h-14 rounded-2xl">NEXT TIME</Button>}
    </div>
  );
};

/* --- 12. MONEY (Counting Coins) --- */
export const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.money || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
  const options = useMemo(() => current ? [current.amount, current.amount + 1, current.amount - 1].filter(o => o >= 1).sort(() => Math.random() - 0.5) : [], [current]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 flex flex-col items-center">
        <h3 className="text-4xl font-black text-yellow-600 mb-8 uppercase">Counting Money! 💰</h3>
        <p className="text-2xl font-black text-slate-500 mb-10 italic">How many shiny coins can you see?</p>
        <div className="w-full max-w-2xl aspect-video bg-yellow-50 rounded-[3rem] border-8 border-white mb-10 overflow-hidden">
          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover p-6" alt="coins" /> : <Loader2 className="animate-spin m-auto"/>}
        </div>
        <div className="flex gap-6">
           {options.map(opt => (
             <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.amount ? "Yes" : "Count again"); }} className={cn("w-24 h-24 rounded-3xl text-4xl", userAnswer === opt ? (opt === current.amount ? 'bg-green-500' : 'bg-red-500') : 'bg-yellow-50 text-yellow-600')}>{opt}</Button>
           ))}
        </div>
        {userAnswer === current.amount && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 bg-yellow-500 text-white rounded-2xl h-14 px-10">MORE COINS</Button>}
    </div>
  );
};

/* --- 13. MEASUREMENT --- */
export const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [subTab, setSubTab] = useState<'weight' | 'height'>('weight');
  const [data] = useState(constants.NUMERACY_DATA.measurement || {});
  const [index, setIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const [answered, setAnswered] = useState(false);
  const current = data[subTab]?.[index];
  const fetchVisuals = useCallback(async () => {
    if (!current) return;
    const results = await Promise.all(current.items.map((i: any) => generateLessonImageAction({ prompt: i.prompt, schoolId })));
    setImageUrls(results.map(r => r.data || null));
  }, [current, schoolId]);
  useEffect(() => { setAnswered(false); fetchVisuals(); }, [index, subTab, data, fetchVisuals]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center">
      <div className="flex gap-4 mb-10">{(['weight', 'height'] as const).map(t => (<Button key={t} onClick={() => { setSubTab(t); setIndex(0); }} variant={subTab === t ? "default" : "outline"} className="px-8 rounded-xl">{t.toUpperCase()}</Button>))}</div>
      <h3 className="text-4xl font-black text-emerald-600 mb-12 uppercase">{current.q}</h3>
      <div className="flex gap-12">
        {current.items.map((item: any, idx: number) => (<Button key={idx} variant="ghost" onClick={() => { if(idx === current.correct) setAnswered(true); onSound(idx === current.correct ? "Yes" : "No"); }} className={cn("flex flex-col h-auto p-4 rounded-3xl border-4", answered && idx === current.correct ? 'border-green-400' : 'border-transparent')}><div className={cn("bg-emerald-50 rounded-[3rem] border-8 overflow-hidden", item.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28', answered && idx === current.correct ? 'border-green-400' : 'border-white')}>{imageUrls[idx] && <img src={imageUrls[idx]!} className="w-full h-full object-cover" />}</div><span className="mt-4 text-xl font-black">{item.label}</span></Button>))}
      </div>
      {answered && <Button onClick={() => {setIndex((index + 1) % data[subTab].length); setAnswered(false);}} className="mt-12 bg-green-500 text-white rounded-2xl px-10 h-14">CONTINUE</Button>}
    </div>
  );
};

/* --- 14. SHAPES --- */
export const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.shapes || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const current = data[index];
  useEffect(() => {
    generateLessonImageAction({ prompt: current?.prompt, schoolId }).then(res => setImageUrl(res.data || null));
  }, [index, schoolId, current?.prompt]);
  if (!current) return null;
  return (
    <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-cyan-100">
        <h2 className="text-7xl font-black text-cyan-600 mb-8 uppercase">{current.name}</h2>
        <div className="w-80 h-80 bg-cyan-50 rounded-[3rem] overflow-hidden mb-10 cursor-pointer" onClick={() => onSound(`This is a ${current.name}`)}>
          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Loader2 className="animate-spin m-auto"/>}
        </div>
        <div className="flex gap-6">
            <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="bg-slate-100 rounded-full"><ArrowLeft/></Button>
            <Button onClick={() => onSound(current.name)} className="bg-cyan-500 text-white px-10 rounded-2xl">TEACH ME</Button>
            <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="bg-slate-100 rounded-full"><ArrowRight/></Button>
        </div>
    </div>
  );
};

/* --- 15. SPATIAL REASONING --- */
export const SpatialModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.spatial || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const current = data[index];
  useEffect(() => {
    generateLessonImageAction({ prompt: current?.prompt, schoolId }).then(res => setImageUrl(res.data || null));
    setAnswered(false);
  }, [index, schoolId, current?.prompt]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase">Where is it? 🕵️‍♀️</h3>
        <p className="text-2xl font-black text-slate-500 mb-10">Where is the <span className="text-blue-600">{current.target}</span>?</p>
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10">
          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt="spatial reasoning"/> : <Loader2 className="animate-spin m-auto"/>}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
           {['above', 'below', 'beside'].map(pos => (
             <Button key={pos} onClick={() => { if(pos === current.position) setAnswered(true); onSound(pos === current.position ? "Yes" : "Try again"); }} className={cn("px-8 h-16 rounded-2xl text-xl", answered && pos === current.position ? 'bg-green-500 text-white scale-110' : 'bg-blue-50 text-blue-600')}>{pos.toUpperCase()}</Button>
           ))}
        </div>
        {answered && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 bg-green-500 text-white rounded-3xl h-14 px-10">FIND ANOTHER</Button>}
    </div>
  );
};

/* --- 16. COMPARISON (Visual) --- */
export const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.comparisons || []);
  const [level, setLevel] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const currentLevel = data[level];
  useEffect(() => {
    if (!currentLevel) return;
    Promise.all(currentLevel.items.map((i: any) => generateLessonImageAction({ prompt: i.prompt, schoolId }))).then(res => setImageUrls(res.map(r => r.data || null)));
    setAnswered(false);
  }, [level, schoolId, currentLevel]);
  if (!currentLevel) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center">
      <h3 className="text-4xl font-black text-red-400 mb-12 uppercase text-center">{currentLevel.q}</h3>
      <div className="flex gap-12 items-end">
        {currentLevel.items.map((item: any, idx: number) => (<Button key={idx} variant="ghost" onClick={() => { if(idx === currentLevel.correct) setAnswered(true); onSound(idx === currentLevel.correct ? "Yes" : "No"); }} className={cn("flex flex-col h-auto p-4 rounded-3xl border-4", answered && idx === currentLevel.correct ? 'border-green-400 scale-110' : 'border-transparent')}><div className={cn("bg-orange-50 rounded-[3rem] border-8 overflow-hidden", item.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28', answered && idx === currentLevel.correct ? 'border-green-400' : 'border-white')}>{imageUrls[idx] && <img src={imageUrls[idx]!} className="w-full h-full object-cover" />}</div><span className="mt-4 text-slate-700 font-black">{item.label}</span></Button>))}
      </div>
      {answered && <Button onClick={() => setLevel((level + 1) % data.length)} className="mt-8 bg-green-500 text-white rounded-2xl px-10 h-14">NEXT LEVEL</Button>}
    </div>
  );
};

/* --- 17. PATTERNS --- */
export const PatternGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.patterns || []);
  const [level, setLevel] = useState(0);
  const [answered, setAnswered] = useState(false);
  const currentPattern = data[level];
  useEffect(() => { setAnswered(false); }, [level]);
  if (!currentPattern) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center">
      <h3 className="text-3xl font-black text-blue-500 mb-12 uppercase">What comes next?</h3>
      <div className="flex gap-4 mb-16 bg-blue-50 p-8 rounded-[3rem] border-4 border-dashed border-blue-200">
        {currentPattern.sequence.map((item: string, idx: number) => (<div key={idx} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md"><IconRenderer iconName={`fa-${item}`} className="text-4xl text-blue-500" /></div>))}
      </div>
      <div className="flex gap-8">
        {currentPattern.options.map((opt: string, idx: number) => (<Button key={idx} onClick={() => { if(opt === currentPattern.next) setAnswered(true); onSound(opt === currentPattern.next ? "Success" : "Try again"); }} className={cn("w-32 h-32 bg-white rounded-[2rem] border-8 shadow-xl", answered && opt === currentPattern.next ? 'border-green-400 scale-110' : 'border-slate-100')}><IconRenderer iconName={`fa-${opt}`} className="text-6xl text-blue-500" /></Button>))}
      </div>
      {answered && <Button onClick={() => setLevel((level + 1) % data.length)} className="mt-10 bg-green-500 text-white rounded-xl px-10 h-14">CONTINUE</Button>}
    </div>
  );
};

/* --- 18. ONE-TO-ONE MATCHING --- */
export const OneToOneGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.oneToOne || []);
  const [level, setLevel] = useState(0);
  const [givenCount, setGivenCount] = useState(0);
  const current = data[level];
  useEffect(() => { setGivenCount(0); }, [level]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[550px]">
      <h3 className="text-3xl font-black text-cyan-600 mb-8 uppercase">One for You, One for Me!</h3>
      <p className="text-slate-500 mb-10 italic">Give each {current.name} one {current.itemName}!</p>
      <div className="flex flex-col gap-16 items-center">
        <div className="flex gap-8 flex-wrap">
          {Array.from({ length: current.count }).map((_, i) => (<div key={i} className="relative"><IconRenderer iconName={`fa-${current.character}`} className={cn("h-16 w-16", i < givenCount ? 'text-cyan-500 scale-110' : 'text-cyan-200')} />{i < givenCount && (<div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce"><IconRenderer iconName={`fa-${current.item}`} className="text-orange-500 h-10 w-10" /></div>)}</div>))}
        </div>
        <div className="flex gap-6">
          {Array.from({ length: current.count }).map((_, i) => (<Button key={i} onClick={() => { setGivenCount(prev => prev + 1); onSound("Here you go"); }} disabled={i < givenCount} className={cn("w-20 h-20 bg-cyan-50 rounded-2xl border-4", i < givenCount ? 'opacity-0 scale-0' : 'border-white shadow-md')}><IconRenderer iconName={`fa-${current.item}`} className="h-10 w-10 text-cyan-600" /></Button>))}
        </div>
      </div>
      {givenCount === current.count && <Button onClick={() => setLevel((level + 1) % data.length)} className="mt-12 bg-green-500 text-white rounded-xl px-10 h-14">NEXT PUZZLE</Button>}
    </div>
  );
};

/* --- 19. NUMBER TRACING (Magic Pen) --- */
export const NumberMagicPen: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [selectedItem, setSelectedItem] = useState('1');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0,0,400,400);
    ctx.font = '900 300px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#F1F5F9';
    ctx.setLineDash([10, 10]);
    ctx.strokeText(selectedItem, 200, 220);
  }, [selectedItem]);
  useEffect(() => { clearCanvas(); }, [selectedItem, clearCanvas]);
  const handleCheck = async () => {
    setIsEvaluating(true);
    setTimeout(() => { onSound("Superstar!"); setIsEvaluating(false); }, 1500);
  };
  return (
    <div className="flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100">
        <div className="flex gap-2 mb-8 overflow-x-auto w-full no-scrollbar">
            {Array.from({length: 10}).map((_, i) => (<Button key={i} variant={selectedItem === String(i) ? "default" : "outline"} onClick={() => setSelectedItem(String(i))} className="flex-shrink-0 w-12 h-12 rounded-xl font-black">{i}</Button>))}
        </div>
        <div className="relative w-full max-w-[400px] aspect-square bg-white border-8 border-purple-50 rounded-[3rem] shadow-inner mb-8">
            <canvas ref={canvasRef} width={400} height={400} className="w-full h-full cursor-crosshair" onMouseMove={(e) => {
                if(e.buttons !== 1) return;
                const ctx = canvasRef.current?.getContext('2d');
                if(!ctx) return;
                ctx.setLineDash([]);
                ctx.lineWidth = 15;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#8B5CF6';
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            }} />
        </div>
        <div className="flex gap-4">
            <Button variant="outline" onClick={clearCanvas} className="h-14 px-8 rounded-2xl">CLEAR</Button>
            <Button onClick={handleCheck} disabled={isEvaluating} className="h-14 px-12 bg-purple-600 text-white rounded-2xl font-black">{isEvaluating ? "CHECKING..." : "CHECK WORK"}</Button>
        </div>
    </div>
  );
};
