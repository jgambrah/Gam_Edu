
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import {
  Play, Square, Image as ImageIcon, User as UserIcon, Video, Ghost,
  Plus, Trash2, Save, Wand2, Languages, Sigma, Microscope, Loader2, PlusCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// --- HELPERS ---
const cleanLatex = (formula: string = "") => {
  return formula.replace(/\$\$/g, '').replace(/\$/g, '').replace(/\\\[/g, '').replace(/\\\]/g, '').trim();
};

function SafeMath({ formula }: { formula: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-5 w-20 bg-slate-100 animate-pulse rounded" />;
  return <BlockMath math={cleanLatex(formula)} />;
}

// --- ASSETS ---
const SPRITE_LIBRARY = [
  { id: 'cat', name: 'Cat', emoji: '🐱', url: 'https://raw.githubusercontent.com/LLK/scratch-render/develop/test/fixtures/mouse.png' },
  { id: 'ghost', name: 'Ghost', emoji: '👻', url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }
];

export default function ScratchEnginePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [activeSprite, setActiveSprite] = useState(SPRITE_LIBRARY[0]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const p5ContainerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  const engineState = useRef({
    x: 0, y: 0, prevX: 0, prevY: 0, direction: 90,
    size: 100, message: '', isPenDown: false, penColor: '#4C97FF', shouldClear: false
  });

  // --- BLOCKLY SETUP ---
  const { workspace } = useBlocklyWorkspace({
    ref: blocklyDivRef,
    toolboxConfiguration: {
      kind: 'categoryToolbox',
      contents: [
        { kind: 'category', name: 'Events', colour: '#FFD500', contents: [{ kind: 'block', type: 'event_whenflagclicked' }] },
        { kind: 'category', name: 'Motion', colour: '#4C97FF', contents: [{ kind: 'block', type: 'motion_move' }, { kind: 'block', type: 'motion_turnright' }] },
        { kind: 'category', name: 'Looks', colour: '#9966FF', contents: [{ kind: 'block', type: 'looks_say' }, { kind: 'block', type: 'looks_changesizeby' }] },
        { kind: 'category', name: 'Pen', colour: '#00B295', contents: [{ kind: 'block', type: 'pen_clear' }, { kind: 'block', type: 'pen_pendown' }, { kind: 'block', type: 'pen_penup' }] },
        { kind: 'category', name: 'Variables', colour: '#FF8C1A', custom: 'VARIABLE' },
      ]
    },
  });

  // --- RUNNER ---
  const runCode = async () => {
    if (!workspace) return;
    const code = javascriptGenerator.workspaceToCode(workspace);
    
    const move = (steps: number) => {
      const rad = (engineState.current.direction - 90) * (Math.PI / 180);
      engineState.current.x += steps * Math.cos(rad);
      engineState.current.y += steps * Math.sin(rad);
    };
    const say = (msg: string) => {
      engineState.current.message = msg;
      setTimeout(() => engineState.current.message = '', 3000);
    };
    const wait = (s: number) => new Promise(res => setTimeout(res, s * 1000));
    const penClear = () => engineState.current.shouldClear = true;
    const setPen = (down: boolean) => engineState.current.isPenDown = down;

    try {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const runner = new AsyncFunction('move', 'say', 'wait', 'penClear', 'setPen', code);
      await runner(move, say, wait, penClear, setPen);
      confetti();
    } catch (e) {
      toast({ title: "Execution Error", variant: "destructive" });
    }
  };

  // --- P5 STAGE ---
  useEffect(() => {
    if (typeof window === 'undefined' || !p5ContainerRef.current) return;

    const sketch = (p: p5) => {
      let spriteImg: p5.Image;
      let penLayer: p5.Graphics;
      let capture: p5.Element;

      p.setup = () => {
        p.createCanvas(480, 360).parent(p5ContainerRef.current!);
        penLayer = p.createGraphics(480, 360);
        p.imageMode(p.CENTER);
        if (activeSprite.url && activeSprite.url.startsWith('http')) {
            p.loadImage(activeSprite.url, img => spriteImg = img);
        }
      };

      p.draw = () => {
        p.background(255);

        // Video
        if (isVideoOn) {
          if (!capture) { capture = p.createCapture(p.VIDEO); capture.hide(); }
          p.push(); p.translate(p.width, 0); p.scale(-1, 1);
          p.tint(255, 100); p.image(capture as any, p.width/2, p.height/2, p.width, p.height);
          p.pop();
        }

        // Pen
        if (engineState.current.shouldClear) { penLayer.clear(); engineState.current.shouldClear = false; }
        if (engineState.current.isPenDown) {
          penLayer.stroke(engineState.current.penColor);
          penLayer.strokeWeight(4);
          penLayer.line(p.width/2 + engineState.current.prevX, p.height/2 - engineState.current.prevY, p.width/2 + engineState.current.x, p.height/2 - engineState.current.y);
        }
        p.image(penLayer, p.width/2, p.height/2);

        // Sprite
        p.push();
        p.translate(p.width/2 + engineState.current.x, p.height/2 - engineState.current.y);
        p.rotate(p.radians(engineState.current.direction - 90));
        if (spriteImg) p.image(spriteImg, 0, 0, 80, 80);
        else { p.textSize(50); p.text(activeSprite.emoji, 0, 0); }
        
        // Bubble
        if (engineState.current.message) {
            p.fill(255); p.rect(20, -60, 100, 30, 5);
            p.fill(0); p.noStroke(); p.textSize(12); p.text(engineState.current.message, 25, -40);
        }
        p.pop();

        engineState.current.prevX = engineState.current.x;
        engineState.current.prevY = engineState.current.y;
      };
    };

    p5InstanceRef.current = new p5(sketch);
    return () => p5InstanceRef.current?.remove();
  }, [activeSprite, isVideoOn]);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <Badge className="bg-white/20 hover:bg-white/30 border-none"><Bot className="w-5 h-5"/></Badge>
          <h1 className="text-xl font-bold italic">SCRATCH ACADEMY</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={runCode} className="bg-green-500 hover:bg-green-600 rounded-full px-6">
            <Play className="w-4 h-4 mr-2 fill-current"/> GO
          </Button>
          <Button variant="destructive" className="rounded-full w-10 h-10 p-0" onClick={() => window.location.reload()}>
            <Square className="w-4 h-4 fill-current"/>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Blockly */}
        <div className="flex-1 bg-white relative" ref={blocklyDivRef} />

        {/* Stage & Library */}
        <div className="w-[500px] bg-slate-100 border-l p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col items-center">
             <div ref={p5ContainerRef} className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-white w-[480px] h-[360px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl p-4">
               <Label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Sprites</Label>
               <div className="flex gap-2 flex-wrap">
                  {SPRITE_LIBRARY.map(s => (
                    <button key={s.id} onClick={() => setActiveSprite(s)} className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${activeSprite.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
                      {s.emoji}
                    </button>
                  ))}
               </div>
            </Card>

            <Card className="rounded-2xl p-4 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-500"/>
                  <span className="text-xs font-bold">Webcam</span>
               </div>
               <button onClick={() => setIsVideoOn(!isVideoOn)} className={`px-4 py-1 rounded-full text-[10px] font-black ${isVideoOn ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {isVideoOn ? 'ON' : 'OFF'}
               </button>
            </Card>
          </div>

          <Card className="bg-slate-900 p-6 rounded-[30px] text-white">
             <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-[10px] text-slate-500">X POSITION</p><p className="font-mono font-bold text-xl">{Math.round(engineState.current.x)}</p></div>
                <div><p className="text-[10px] text-slate-500">Y POSITION</p><p className="font-mono font-bold text-xl">{Math.round(engineState.current.y)}</p></div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
