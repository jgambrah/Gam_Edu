'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Palette, Pencil, Eraser, Droplet, Star, 
  Save, Trash2, Layout, Image as ImageIcon, Sparkles,
  ChevronRight, Circle, Square as SquareIcon, Triangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { Label } from '@/components/ui/label';

// --- JUNIOR ART STUDIO COMPONENT ---
export default function ArtStudio({ schoolId }: { schoolId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // Tool States
    const [tool, setTool] = useState<'brush' | 'pencil' | 'eraser' | 'bucket' | 'stamp'>('brush');
    const [color, setColor] = useState('#FF0000');
    const [brushSize, setBrushSize] = useState(10);
    const [selectedShape, setSelectedShape] = useState<'circle' | 'square' | 'star'>('circle');

    // Quest States
    const [currentQuestIdx, setCurrentQuestIdx] = useState(0);
    const questsQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_art_quests'), 
            where('schoolId', '==', schoolId),
            orderBy('createdAt', 'desc')
        ) : null, [firestore, schoolId]
    );
    const { data: dbQuests } = useCollection<any>(questsQuery);

    // --- CANVAS INITIALIZATION ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = 500;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    // --- DRAWING LOGIC ---
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.top;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        if (tool === 'bucket') {
            floodFill(Math.floor(x), Math.floor(y), color);
            return;
        }

        if (tool === 'stamp') {
            drawStamp(x, y);
            return;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
        ctx.lineWidth = tool === 'pencil' ? 2 : brushSize;
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // --- FLOOD FILL (PAINT BUCKET) ---
    const floodFill = (startX: number, startY: number, fillColor: string) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const targetColor = getPixelColor(data, startX, startY, canvas.width);
        const fillRGB = hexToRgb(fillColor);

        if (colorsMatch(targetColor, fillRGB)) return;

        const pixels = [{ x: startX, y: startY }];
        while (pixels.length > 0) {
            const { x, y } = pixels.pop()!;
            const currentColor = getPixelColor(data, x, y, canvas.width);
            
            if (colorsMatch(currentColor, targetColor)) {
                setPixelColor(data, x, y, canvas.width, fillRGB);
                if (x > 0) pixels.push({ x: x - 1, y });
                if (x < canvas.width - 1) pixels.push({ x: x + 1, y });
                if (y > 0) pixels.push({ x, y: y - 1 });
                if (y < canvas.height - 1) pixels.push({ x, y: y + 1 });
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    // --- STAMP LOGIC ---
    const drawStamp = (x: number, y: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (selectedShape === 'circle') ctx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
        else if (selectedShape === 'square') ctx.rect(x - brushSize, y - brushSize, brushSize * 2, brushSize * 2);
        else if (selectedShape === 'star') {
            // Draw a quick star
            for(let i=0; i<5; i++) {
                ctx.lineTo(Math.cos((18+i*72)/180*Math.PI)*brushSize*2+x,-Math.sin((18+i*72)/180*Math.PI)*brushSize*2+y);
                ctx.lineTo(Math.cos((54+i*72)/180*Math.PI)*brushSize+x,-Math.sin((54+i*72)/180*Math.PI)*brushSize+y);
            }
            ctx.closePath();
        }
        ctx.fill();
        confetti({ particleCount: 10, origin: { x: x/window.innerWidth, y: y/window.innerHeight } });
    };

    // --- SAVE LOGIC ---
    const handleSave = async () => {
        if (!user || !firestore) return;
        const dataUrl = canvasRef.current?.toDataURL();
        await addDoc(collection(firestore, 'junior_artworks'), {
            userId: user.uid,
            schoolId: schoolId,
            image: dataUrl,
            createdAt: serverTimestamp()
        });
        confetti();
        toast({ title: "Masterpiece Saved!", description: "Your art is now in the school gallery!" });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            
            {/* 1. QUEST BAR */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-[40px] text-white shadow-xl flex justify-between items-center border-b-8 border-rose-700">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">
                            Quest: {dbQuests?.[currentQuestIdx]?.title || 'Free Drawing Time!'}
                        </h3>
                        <p className="text-sm font-bold opacity-80 italic">
                            {dbQuests?.[currentQuestIdx]?.instruction || 'Draw anything you imagine! ✨'}
                        </p>
                    </div>
                </div>
                <Button 
                    variant="secondary" 
                    onClick={() => setCurrentQuestIdx(prev => (prev + 1) % (dbQuests?.length || 1))}
                    className="rounded-2xl font-black"
                >
                    New Quest <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* 2. LEFT TOOLBAR */}
                <aside className="lg:col-span-3 space-y-4">
                    <Card className="rounded-[40px] border-4 border-pink-100 shadow-sm overflow-hidden bg-white">
                        <CardContent className="p-6 space-y-8">
                            
                            {/* TOOLS */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Magic Tools</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'brush', icon: <Palette /> },
                                        { id: 'pencil', icon: <Pencil /> },
                                        { id: 'bucket', icon: <Droplet /> },
                                        { id: 'stamp', icon: <Star /> },
                                        { id: 'eraser', icon: <Eraser /> }
                                    ].map((t) => (
                                        <Button 
                                            key={t.id}
                                            variant={tool === t.id ? 'default' : 'outline'}
                                            onClick={() => setTool(t.id as any)}
                                            className={`h-14 rounded-2xl border-2 transition-all ${tool === t.id ? 'bg-pink-500 border-pink-700 scale-105 shadow-md' : 'border-slate-100 hover:bg-pink-50'}`}
                                        >
                                            {t.icon}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* COLORS */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Paint Palette</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF', '#000000'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`aspect-square rounded-full border-4 transition-all transform hover:scale-110 ${color === c ? 'border-slate-800 shadow-lg scale-110' : 'border-white shadow-sm'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* BRUSH SIZE */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brush Size</Label>
                                <div className="px-2">
                                    <input 
                                        type="range" min="2" max="50" value={brushSize} 
                                        onChange={e => setBrushSize(parseInt(e.target.value))}
                                        className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                </div>
                            </div>

                            <Button 
                                variant="destructive" 
                                onClick={() => {
                                    const canvas = canvasRef.current;
                                    const ctx = canvas?.getContext('2d');
                                    if(canvas && ctx) {
                                      ctx.fillStyle = "#FFFFFF";
                                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                                    }
                                }}
                                className="w-full h-12 rounded-2xl font-black uppercase text-xs tracking-widest"
                            >
                                <Trash2 className="mr-2 w-4 h-4" /> Start Over
                            </Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* 3. DRAWING CANVAS */}
                <main className="lg:col-span-9 space-y-4">
                    <div className="relative bg-white rounded-[60px] shadow-2xl border-[12px] border-white overflow-hidden cursor-crosshair touch-none group">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-[500px]"
                        />
                        
                        {/* Overlay Tool Indicator */}
                        <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Badge className="bg-slate-900/50 backdrop-blur-md px-4 py-2 text-xs font-black uppercase rounded-full">
                                Tool: {tool}
                            </Badge>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center bg-white/50 p-4 rounded-[30px] border-2 border-white backdrop-blur-sm">
                        <div className="flex items-center gap-3 ml-4">
                             <div className="flex -space-x-2">
                                {['🎨','🖌️','🖍️','✨'].map((e,i) => <span key={i} className="text-2xl drop-shadow-sm">{e}</span>)}
                             </div>
                             <span className="text-xs font-bold text-slate-500 italic">"Every child is an artist."</span>
                        </div>
                        <Button 
                            onClick={handleSave}
                            className="h-16 px-12 bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-3xl shadow-[0_8px_0_#15803d] active:translate-y-1 active:shadow-none transition-all"
                        >
                            <Save className="mr-2 w-6 h-6" /> SAVE MASTERPIECE
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}

// --- UTILITY HELPERS ---
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

function getPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number) {
    const i = (y * width + x) * 4;
    return [data[i], data[i+1], data[i+2]];
}

function setPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) {
    const i = (y * width + x) * 4;
    data[i] = color[0];
    data[i+1] = color[1];
    data[i+2] = color[2];
    data[i+3] = 255;
}

function colorsMatch(c1: number[], c2: number[]) {
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`inline-block font-bold rounded-md ${className}`}>{children}</span>;
}