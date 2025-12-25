
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { 
  Play, Square, Image as ImageIcon, 
  User as UserIcon, Video, Volume2, Plus, Trash2, Ghost, MousePointer2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// 1. ASSET LIBRARIES
const DEFAULT_SPRITES = [
  { id: 'cat', name: 'Cat', emoji: '🐱', url: 'https://raw.githubusercontent.com/LLK/scratch-render/develop/test/fixtures/mouse.png' },
  { id: 'ghost', name: 'Ghost', emoji: '👻', url: 'https://cdn.pixabay.com/photo/2012/04/18/13/22/ghost-37013_960_720.png' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', url: 'https://openclipart.org/download/216413/rocket-ship.svg' }
];

const DEFAULT_BACKDROPS = [
  { id: 'white', name: 'Plain', color: '#FFFFFF', img: null },
  { id: 'blue', name: 'Sky', color: '#e0f2fe', img: 'https://wallpaperaccess.com/full/1595162.jpg' },
  { id: 'stars', name: 'Space', color: '#0f172a', img: 'https://img.freepik.com/free-vector/space-background-with-stars_23-2148906354.jpg' }
];

export default function ScratchEngine() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [activeSprite, setActiveSprite] = useState(DEFAULT_SPRITES[0]);
  const [activeBackdrop, setActiveBackdrop] = useState(DEFAULT_BACKDROPS[0]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const { toast } = useToast();
  const p5Instance = useRef<p5 | null>(null);

  // Internal Engine State
  const engineState = useRef({
    x: 0,
    y: 0,
    direction: 90,
    size: 80,
    sayText: ""
  });

  // --- 2. BLOCKLY SETUP (ZELOS) ---
  useEffect(() => {
    if (!blocklyRef.current) return;

    // Define Custom Blocks
    Blockly.Blocks['motion_move'] = {
      init: function() {
        this.appendValueInput("STEPS").setCheck("Number").appendField("move");
        this.appendField("steps");
        this.setPreviousStatement(true, null); this.setNextStatement(true, null);
        this.setColour("#4C97FF");
      }
    };

    Blockly.Blocks['looks_say'] = {
      init: function() {
        this.appendValueInput("TEXT").setCheck("String").appendField("say");
        this.setPreviousStatement(true, null); this.setNextStatement(true, null);
        this.setColour("#9966FF");
      }
    };

    // Define JavaScript Generators
    javascriptGenerator.forBlock['motion_move'] = (block) => {
      const steps = javascriptGenerator.valueToCode(block, 'STEPS', 0) || '0';
      return `move(${steps});\n`;
    };

    javascriptGenerator.forBlock['looks_say'] = (block) => {
      const text = javascriptGenerator.valueToCode(block, 'TEXT', 0) || "''";
      return `say(${text});\n`;
    };

    const ws = Blockly.inject(blocklyRef.current, {
        renderer: 'zelos',
        toolbox: `
          <xml>
            <category name="Motion" colour="#4C97FF">
              <block type="motion_move">
                <value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
              </block>
            </category>
            <category name="Looks" colour="#9966FF">
               <block type="looks_say">
                 <value name="TEXT"><shadow type="text"><field name="TEXT">Hello!</field></shadow></value>
               </block>
            </category>
          </xml>
        `,
      });
    setWorkspace(ws);
    return () => ws.dispose();
  }, []);

  // --- 3. P5.JS STAGE ENGINE ---
  useEffect(() => {
    if (!canvasParentRef.current) return;
    
    if (p5Instance.current) p5Instance.current.remove();

    const sketch = (p: p5) => {
      let spriteImg: p5.Image;
      let bgImg: p5.Image | null = null;
      let capture: any;

      p.setup = () => {
        p.createCanvas(480, 360).parent(canvasParentRef.current!);
        p.imageMode(p.CENTER);
        
        p.loadImage(activeSprite.url, 
            img => spriteImg = img,
            (err) => { console.error("Sprite Load Failed:", err); }
        );
        if (activeBackdrop.img) {
            p.loadImage(activeBackdrop.img, 
                img => bgImg = img,
                (err) => { console.error("Backdrop Load Failed:", err); }
            );
        }
      };

      p.draw = () => {
        if (bgImg) p.image(bgImg, p.width/2, p.height/2, p.width, p.height);
        else p.background(activeBackdrop.color);

        if (isVideoOn) {
            if (!capture) { capture = p.createCapture(p.VIDEO); capture.hide(); }
            p.push(); p.translate(p.width, 0); p.scale(-1, 1);
            p.tint(255, 120); p.image(capture, p.width/2, p.height/2, p.width, p.height);
            p.pop();
        }

        p.push();
        const screenX = p.width/2 + engineState.current.x;
        const screenY = p.height/2 - engineState.current.y;
        p.translate(screenX, screenY);
        
        if (spriteImg) {
            p.image(spriteImg, 0, 0, engineState.current.size, engineState.current.size);
        } else {
            p.textSize(60); p.textAlign(p.CENTER, p.CENTER);
            p.text(activeSprite.emoji, 0, 0);
        }

        if (engineState.current.sayText) {
            p.fill(255); p.stroke(200); p.rect(20, -80, 100, 40, 10);
            p.fill(0); p.noStroke(); p.textSize(12);
            p.text(engineState.current.sayText, 70, -60);
        }
        p.pop();
      };
    };

    p5Instance.current = new p5(sketch);
    return () => p5Instance.current?.remove();
  }, [activeSprite, activeBackdrop, isVideoOn]);

  // --- 4. ENGINE CONTROLS ---
  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    
    const move = (steps: number) => engineState.current.x += steps;
    const say = (text: string) => {
        engineState.current.sayText = text;
        const u = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(u);
        setTimeout(() => engineState.current.sayText = "", 3000);
    };

    try {
      const runner = new Function('move', 'say', code);
      runner(move, say);
    } catch (e) {
      toast({ title: "Code Error", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] overflow-hidden">
    {/* 1. Header is separate and stays at the top */}
    <div className="bg-[#4C97FF] p-3 flex justify-between items-center text-white z-50 shadow-md">
       <h1 className="text-xl font-black italic ml-4">ACADEMY STUDIO</h1>
       <div className="flex gap-2">
         <Button onClick={runCode} className="bg-[#4dc94d] rounded-full h-10 px-8">▶ GO</Button>
         <Button onClick={() => window.location.reload()} variant="destructive" className="h-10 w-10">■</Button>
       </div>
    </div>

    <div className="flex flex-1 overflow-hidden relative">
      {/* 2. Coding Workspace (Left Side) */}
      <div className="flex-1 h-full relative bg-white">
        {/* Visual Guide for students */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 flex flex-col items-center">
            <MousePointer2 className="w-20 h-20 mb-4" />
            <p className="text-4xl font-black uppercase">Drag Blocks Here</p>
        </div>
        <div ref={blocklyRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* 3. Stage & Assets (Right Side) - This stays completely separate */}
      <div className="w-[520px] p-4 flex flex-col gap-4 bg-slate-50 border-l overflow-y-auto z-10 shadow-inner">
        <div ref={canvasParentRef} className="rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white bg-white w-[480px] h-[360px]" />
        
        <div className="grid grid-cols-2 gap-3">
          {/* SPRITES */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Characters</span>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_SPRITES.map(s => (
                <button 
                    key={s.id} 
                    onClick={() => setActiveSprite(s)} 
                    className={`w-14 h-14 text-3xl rounded-2xl border-2 transition-all ${activeSprite.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}
                >
                    {s.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* BACKDROPS */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Backdrops</span>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_BACKDROPS.map(b => (
                <button 
                    key={b.id} 
                    onClick={() => setActiveBackdrop(b)}
                    className={`w-12 h-12 rounded-xl border-4 transition-all ${activeBackdrop.id === b.id ? 'border-blue-500' : 'border-white'}`}
                    style={{ backgroundColor: b.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
