
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { Play, Square, Video, Plus, Trash2, Volume2, Ghost, MousePointer2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import confetti from 'canvas-confetti';

const SPRITE_LIBRARY = [
  { id: 'cat', name: 'Cat', emoji: '🐱', url: 'https://raw.githubusercontent.com/LLK/scratch-render/develop/test/fixtures/mouse.png' },
  { id: 'ghost', name: 'Ghost', emoji: '👻', url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' },
];

const ScratchEngine = () => {
    const { toast } = useToast();
    const [activeSprite, setActiveSprite] = useState(SPRITE_LIBRARY[0]);
    const [isLoading, setIsLoading] = useState(false);
    const p5ContainerRef = useRef<HTMLDivElement>(null);
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const engineState = useRef({ x: 0, y: 0, direction: 90, message: '', isPenDown: false });

    // --- BLOCKLY WORKSPACE ---
    const { workspace } = useBlocklyWorkspace({
        ref: blocklyDivRef,
        toolboxConfiguration: {
            kind: 'categoryToolbox',
            contents: [
                { kind: 'category', name: 'Events', colour: '#FFD500', contents: [{ kind: 'block', type: 'event_whenflagclicked' }] },
                { kind: 'category', name: 'Motion', colour: '#4C97FF', contents: [{ kind: 'block', type: 'motion_move' }] },
                { kind: 'category', name: 'Looks', colour: '#9966FF', contents: [{ kind: 'block', type: 'looks_say' }] },
            ]
        },
    });

    const runCode = async () => {
        if (!workspace) return;
        const code = javascriptGenerator.workspaceToCode(workspace);
        const move = (n: number) => engineState.current.x += n;
        const say = (t: string) => { 
            engineState.current.message = t;
            const u = new SpeechSynthesisUtterance(t);
            window.speechSynthesis.speak(u);
            setTimeout(() => engineState.current.message = '', 3000);
        };
        try {
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const runner = new AsyncFunction('move', 'say', code);
            await runner(move, say);
            confetti();
        } catch (e) { toast({ title: "Check your blocks!" }); }
    };

    // --- P5.JS STAGE ---
    useEffect(() => {
        if (typeof window === 'undefined' || !p5ContainerRef.current) return;
        let instance: p5;
        const sketch = (p: p5) => {
            let spriteImg: p5.Image;
            p.setup = () => {
                p.createCanvas(480, 360).parent(p5ContainerRef.current!);
                p.imageMode(p.CENTER);
                if (activeSprite.url && !activeSprite.url.startsWith('data:')) {
                    p.loadImage(activeSprite.url, img => spriteImg = img);
                }
            };
            p.draw = () => {
                p.background(255);
                p.push();
                p.translate(p.width/2 + engineState.current.x, p.height/2 - engineState.current.y);
                if (spriteImg) p.image(spriteImg, 0, 0, 80, 80);
                else { p.textSize(60); p.text(activeSprite.emoji, 0, 0); }
                if (engineState.current.message) {
                    p.fill(255); p.rect(20, -80, 100, 40, 10);
                    p.fill(0); p.textSize(12); p.text(engineState.current.message, 30, -55);
                }
                p.pop();
            };
        };
        instance = new p5(sketch);
        return () => instance.remove();
    }, [activeSprite]);

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden relative">
            {/* INSTRUCTION WATERMARK */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 z-0">
                <h1 className="text-[12rem] font-black uppercase -rotate-12">Code</h1>
            </div>

            <div className="flex-1 relative z-10" ref={blocklyDivRef} />

            <div className="w-[500px] flex flex-col p-4 gap-4 bg-slate-100 border-l z-20 shadow-2xl">
                <div className="relative aspect-video bg-white rounded-3xl overflow-hidden border-8 border-white shadow-xl" ref={p5ContainerRef} />
                <div className="flex gap-2">
                    <Button onClick={runCode} className="flex-1 bg-green-500 hover:bg-green-600 rounded-2xl h-14 font-black text-xl">
                        <Play className="mr-2 fill-current" /> GO
                    </Button>
                    <Button variant="destructive" onClick={() => window.location.reload()} className="h-14 w-14 rounded-2xl">
                        <Square className="fill-current" />
                    </Button>
                </div>
                <Tabs defaultValue="sprites" className="flex-1">
                    <TabsList className="grid w-full grid-cols-2 rounded-xl">
                        <TabsTrigger value="sprites">Sprites</TabsTrigger>
                        <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sprites" className="p-4 bg-white rounded-2xl mt-2 border">
                        <div className="grid grid-cols-3 gap-2">
                            {SPRITE_LIBRARY.map(s => (
                                <button key={s.id} onClick={() => setActiveSprite(s)} className={`p-4 rounded-xl border-2 transition-all ${activeSprite.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
                                    <div className="text-4xl">{s.emoji}</div>
                                </button>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ScratchEngine;
