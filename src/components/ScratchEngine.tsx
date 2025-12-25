
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
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRole } from '@/context/role-context';

// 1. ASSET LIBRARIES
const DEFAULT_SPRITES = [
  { id: 'cat', name: 'Cat', emoji: '🐱', url: '/assets/sprites/cat.png' },
];

const DEFAULT_BACKDROPS = [
  { id: 'white', name: 'Plain', color: '#FFFFFF', img: null },
];


function AddAssetModal({ type, onAdded }: { type: 'sprite' | 'backdrop', onAdded: () => void }) {
    const firestore = useFirestore();
    const [form, setForm] = useState({ name: '', emoji: '', url: '', color: '#4C97FF' });

    const handleSave = async () => {
        if (!firestore) return;
        await addDoc(collection(firestore, 'scratch_assets'), {
            ...form,
            type: type,
            createdAt: serverTimestamp()
        });
        onAdded();
        alert(`${type} Added Successfully!`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-blue-100 text-blue-600 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[30px]">
                <DialogHeader><DialogTitle>Add New {type}</DialogTitle></DialogHeader>
                <div className="space-y-4 p-4">
                    <Input placeholder="Name (e.g. Dragon)" onChange={e => setForm({...form, name: e.target.value})} />
                    <Input placeholder="Emoji (e.g. 🐉)" onChange={e => setForm({...form, emoji: e.target.value})} />
                    <Input placeholder="Image URL (or leave blank to use Emoji)" onChange={e => setForm({...form, url: e.target.value})} />
                    {type === 'backdrop' && (
                        <div className="flex items-center gap-4">
                            <Label>Background Color</Label>
                            <input type="color" onChange={e => setForm({...form, color: e.target.value})} />
                        </div>
                    )}
                    <Button onClick={handleSave} className="w-full bg-blue-600 rounded-2xl h-12">Save to Library</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default function ScratchEngine() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  
  const [activeSprite, setActiveSprite] = useState(DEFAULT_SPRITES[0]);
  const [activeBackdrop, setActiveBackdrop] = useState(DEFAULT_BACKDROPS[0]);

  const [isVideoOn, setIsVideoOn] = useState(false);
  const { toast } = useToast();
  const p5Instance = useRef<p5 | null>(null);
  
  const firestore = useFirestore();
  const { role } = useRole();
  const canEdit = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  // 1. Fetch Sprites from Firebase
    const spriteQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'scratch_assets'), where('type', '==', 'sprite')) : null, 
    [firestore]);
    const { data: dbSprites, forceRefetch: refetchSprites } = useCollection<any>(spriteQuery);

    // 2. Fetch Backdrops from Firebase
    const backdropQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'scratch_assets'), where('type', '==', 'backdrop')) : null, 
    [firestore]);
    const { data: dbBackdrops, forceRefetch: refetchBackdrops } = useCollection<any>(backdropQuery);

    // Fallback to defaults if DB is empty
    const sprites = dbSprites?.length ? dbSprites : DEFAULT_SPRITES;
    const backdrops = dbBackdrops?.length ? dbBackdrops : DEFAULT_BACKDROPS;


  // Global Sprite State (Shared between Blockly and p5)
  const spriteState = useRef({
    x: 0,
    y: 0,
    rotation: 0,
    size: 80,
    sayText: ""
  });

  // --- 2. BLOCKLY SETUP (ZELOS STYLE) ---
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
    javascriptGenerator.forBlock['motion_move'] = (block: any) => {
      const steps = javascriptGenerator.valueToCode(block, 'STEPS', (javascriptGenerator as any).ORDER_ATOMIC) || '0';
      return `move(${steps});\n`;
    };

    javascriptGenerator.forBlock['looks_say'] = (block: any) => {
      const text = javascriptGenerator.valueToCode(block, 'TEXT', (javascriptGenerator as any).ORDER_ATOMIC) || "''";
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
        const screenX = p.width/2 + spriteState.current.x;
        const screenY = p.height/2 - spriteState.current.y;
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
  }, [activeSprite, activeBackdrop, isVideoOn]);

  // --- 4. EXECUTION ENGINE ---
  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    
    const move = (steps: number) => {
      spriteState.current.x += steps;
    };
  
    const say = (text: string) => {
      // 1. Show bubble on screen
      spriteState.current.sayText = text;
      // 2. Browser Voice Engine
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      // 3. Auto-hide bubble after 3 seconds
      setTimeout(() => spriteState.current.sayText = "", 3000);
    };
  
    try {
      // Create the runner
      const runner = new Function('move', 'say', code);
      runner(move, say);
    } catch (e) {
      console.error(e);
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
        <div ref={canvasParentRef} className="rounded-xl shadow-2xl border-4 border-white bg-white w-[480px] h-[360px]" />
        
            <div className="grid grid-cols-2 gap-3">
            {/* Sprite Panel */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-slate-400">Sprites</span>
                {canEdit && <AddAssetModal type="sprite" onAdded={refetchSprites} />}
              </div>
              <div className="flex gap-2 flex-wrap">
                {sprites.map(s => (
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

            {/* Backdrop Panel */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-slate-400">Backdrops</span>
                {canEdit && <AddAssetModal type="backdrop" onAdded={refetchBackdrops} />}
              </div>
              <div className="flex gap-2 flex-wrap">
                {backdrops.map(b => (
                  <button 
                    key={b.id} 
                    onClick={() => setActiveBackdrop(b)}
                    className={`w-10 h-10 rounded-md border-2 transition-all ${activeBackdrop.id === b.id ? 'border-blue-500 shadow-md' : 'border-slate-200'}`}
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

          {/* HUD PROPERTIES */}
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
                  <p className="text-[8px] uppercase text-slate-500">Size</p>
                  <p className="font-mono font-bold">{spriteState.current.size}%</p>
                </div>
             </div>
          </div>
      </div>
    </div>
  </div>
  );
}
