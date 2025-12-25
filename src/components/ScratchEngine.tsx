
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { 
  Play, Square, Image as ImageIcon, 
  User as UserIcon, Video, Volume2, Plus, Trash2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// 1. ASSET LIBRARIES (Using known stable URLs or fallbacks)
const SPRITE_LIBRARY = [
  { id: 'cat', name: 'Scratch Cat', emoji: '🐱', url: 'https://raw.githubusercontent.com/LLK/scratch-render/develop/test/fixtures/mouse.png' }, // Fallback to a stable PNG
  { id: 'dog', name: 'Dog', emoji: '🐶', url: 'https://openclipart.org/download/239335/Cartoon-Dog.svg' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', url: 'https://openclipart.org/download/216413/rocket-ship.svg' }
];

const BACKDROP_LIBRARY = [
  { id: 'white', name: 'Plain', color: '#FFFFFF', img: null },
  { id: 'grid', name: 'Blue Grid', color: '#e0f2fe', img: 'https://wallpaperaccess.com/full/1595162.jpg' },
  { id: 'stars', name: 'Space', color: '#0f172a', img: 'https://img.freepik.com/free-vector/space-background-with-stars_23-2148906354.jpg' }
];

export default function ScratchEngine() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [activeSprite, setActiveSprite] = useState(SPRITE_LIBRARY[0]);
  const [activeBackdrop, setActiveBackdrop] = useState(BACKDROP_LIBRARY[0]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const p5Instance = useRef<p5 | null>(null);

  // Global Sprite State (Shared between Blockly and p5)
  const spriteState = useRef({
    x: 0,
    y: 0,
    rotation: 0,
    size: 100,
    visible: true
  });

  // --- 2. BLOCKLY DEFINITIONS (ZELOS STYLE) ---
  useEffect(() => {
    if (!blocklyRef.current) return;

    // Define Custom Blocks
    Blockly.Blocks['motion_move'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("STEPS").setCheck("Number").appendField("move");
        this.appendField("steps");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4C97FF");
      }
    };

    Blockly.Blocks['speech_speak'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("TEXT").setCheck("String").appendField("speak");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#9966FF");
      }
    };

    // Generators
    javascriptGenerator.forBlock['motion_move'] = (block) => {
      const steps = javascriptGenerator.valueToCode(block, 'STEPS', (javascriptGenerator as any).ORDER_ATOMIC) || '0';
      return `moveSprite(${steps});\n`;
    };

    javascriptGenerator.forBlock['speech_speak'] = (block) => {
      const text = javascriptGenerator.valueToCode(block, 'TEXT', (javascriptGenerator as any).ORDER_ATOMIC) || "''";
      return `speakText(${text});\n`;
    };

    // Inject Blockly
    const ws = Blockly.inject(blocklyRef.current, {
      renderer: 'zelos',
      toolbox: `
        <xml>
          <category name="Motion" colour="#4C97FF">
            <block type="motion_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
          </category>
          <category name="Looks" colour="#9966FF">
             <block type="speech_speak"><value name="TEXT"><shadow type="text"><field name="TEXT">Hello!</field></shadow></value></block>
          </category>
        </xml>
      `,
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.8 }
    });

    setWorkspace(ws);
    return () => ws.dispose();
  }, []);

  // --- 3. P5.JS STAGE ENGINE ---
  useEffect(() => {
    if (!canvasParentRef.current) return;

    const sketch = (p: p5) => {
      let capture: any;
      let spriteImg: p5.Image;
      let bgImg: p5.Image | null = null;

      p.preload = () => {
        // Safe Load: If fetch fails, we use p.rect as fallback
        p.loadImage(activeSprite.url, 
          img => spriteImg = img, 
          err => console.log("Sprite image CORS error - using fallback")
        );
        if (activeBackdrop.img) {
          p.loadImage(activeBackdrop.img, img => bgImg = img);
        }
      };

      p.setup = () => {
        p.createCanvas(480, 360).parent(canvasParentRef.current!);
        p.imageMode(p.CENTER);
        p.angleMode(p.DEGREES);
      };

      p.draw = () => {
        // Draw Background
        if (bgImg) {
          p.image(bgImg, p.width/2, p.height/2, p.width, p.height);
        } else {
          p.background(activeBackdrop.color);
        }

        // Handle Video
        if (isVideoOn) {
          if (!capture) {
            capture = p.createCapture(p.VIDEO);
            capture.size(480, 360);
            capture.hide();
          }
          p.push();
          p.translate(p.width, 0); p.scale(-1, 1);
          p.tint(255, 150); // Ghostly video effect like Scratch
          p.image(capture, p.width/2, p.height/2, p.width, p.height);
          p.pop();
        }

        // Draw Sprite (Center logic)
        p.push();
        p.translate(p.width/2 + spriteState.current.x, p.height/2 - spriteState.current.y);
        p.rotate(spriteState.current.rotation);
        
        if (spriteImg) {
          p.image(spriteImg, 0, 0, spriteState.current.size, spriteState.current.size);
        } else {
          // If fetch failed, draw the emoji as text
          p.textSize(50);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(activeSprite.emoji, 0, 0);
        }
        p.pop();
      };
    };

    p5Instance.current = new p5(sketch);
    return () => p5Instance.current?.remove();
  }, [activeSprite, activeBackdrop, isVideoOn]);

  // --- 4. EXECUTION ENGINE ---
  const runGame = () => {
    const code = (Blockly as any).JavaScript.workspaceToCode(workspace);
    
    // Environment setup for generated code
    const moveSprite = (steps: number) => {
      spriteState.current.x += steps;
    };

    const speakText = (msg: string) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(u);
    };

    try {
      const runner = new Function('moveSprite', 'speakText', code);
      runner(moveSprite, speakText);
    } catch (e) {
      console.error("Execution Error:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] font-sans">
      {/* Navbar */}
      <nav className="bg-[#4C97FF] p-3 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg">
             <ImageIcon className="text-[#4C97FF] w-6 h-6" />
          </div>
          <h1 className="text-xl font-black italic">Academy Studio</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={runGame} className="bg-[#4dc94d] hover:bg-[#3ea03e] px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all">
            <Play className="fill-current w-4 h-4"/> Go
          </button>
          <button onClick={() => window.location.reload()} className="bg-[#ff4c4c] px-4 py-2 rounded-full font-bold">
            <Square className="fill-current w-4 h-4"/>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* BLOCKLY WORKSPACE */}
        <div ref={blocklyRef} className="flex-1 h-full border-r border-slate-200" />

        {/* STAGE AREA */}
        <div className="w-[500px] p-4 flex flex-col gap-4 bg-slate-100 overflow-y-auto">
          
          {/* THE CANVAS */}
          <div ref={canvasParentRef} className="rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-white w-[480px] h-[360px]" />

          {/* ASSET MANAGEMENT PANELS */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Sprite Selector */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><UserIcon className="w-3 h-3"/> Sprites</span>
                <Plus className="w-4 h-4 text-blue-500 cursor-pointer"/>
              </div>
              <div className="flex gap-2 flex-wrap">
                {SPRITE_LIBRARY.map(s => (
                  <button 
                    key={s.id} onClick={() => setActiveSprite(s)}
                    className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${activeSprite.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}
                  >
                    {s.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Backdrop Selector */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Backdrops</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {BACKDROP_LIBRARY.map(b => (
                  <button 
                    key={b.id} onClick={() => setActiveBackdrop(b)}
                    className={`w-10 h-10 rounded-lg border-2 shadow-sm ${activeBackdrop.id === b.id ? 'border-blue-500' : 'border-white'}`}
                    style={{ backgroundColor: b.color }}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* SENSING & SOUND CONTROLS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-slate-600">Video Sensing</span>
               </div>
               <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${isVideoOn ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}
               >
                 {isVideoOn ? 'ON' : 'OFF'}
               </button>
            </div>
            <hr />
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-bold text-slate-600">Audio Feedback</span>
               </div>
               <Badge className="bg-pink-100 text-pink-600 border-none">Active</Badge>
            </div>
          </div>

          {/* PROPERTIES HUD */}
          <div className="bg-slate-800 p-4 rounded-2xl text-white">
             <div className="grid grid-cols-3 text-center gap-2">
                <div>
                  <p className="text-[8px] uppercase text-slate-500">X Position</p>
                  <p className="font-mono font-bold">{spriteState.current.x}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-slate-500">Y Position</p>
                  <p className="font-mono font-bold">{spriteState.current.y}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-slate-500">Direction</p>
                  <p className="font-mono font-bold">{spriteState.current.rotation}°</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
