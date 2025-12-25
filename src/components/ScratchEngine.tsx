
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { 
  Play, Square, Image as ImageIcon, 
  User as UserIcon, Video, Volume2, Plus, Trash2, Move, Ghost, MousePointer2, PlusCircle
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
    const sprites = dbSprites?.length ? dbSprites : [
      { id: 'cat', emoji: '🐱', url: '/assets/sprites/cat.png', name: 'Cat' },
      { id: 'dog', emoji: '🐶', url: 'https://openclipart.org/image/2400px/svg_to_png/219213/Dog-Icon.png', name: 'Dog' },
      { id: 'rocket', emoji: '🚀', url: 'https://openclipart.org/image/2400px/svg_to_png/190875/Rocket-Icon.png', name: 'Rocket' },
    ];
    const backdrops = dbBackdrops?.length ? dbBackdrops : [
      { id: 'white', color: '#FFFFFF', name: 'Plain', img: null },
      { id: 'blue-sky', color: '#87CEEB', name: 'Sky', img: null },
      { id: 'space', color: '#000033', name: 'Space', img: 'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_960_720.jpg' },
    ];

  const [activeSprite, setActiveSprite] = useState(sprites[0]);
  const [activeBackdrop, setActiveBackdrop] = useState(backdrops[0]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const { toast } = useToast();
  
  const engineState = useRef({
    x: 0,
    y: 0,
    direction: 90,
    size: 100,
    sayText: "",
    isJunior: true // Helps trigger the colorful theme
  });

  useEffect(() => {
    if (!blocklyRef.current) return;

    Blockly.Blocks['motion_move'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("STEPS").setCheck("Number").appendField("move");
        this.appendField("steps");
        this.setPreviousStatement(true, null); this.setNextStatement(true, null);
        this.setColour("#4C97FF");
      }
    };

    Blockly.Blocks['looks_say'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("TEXT").setCheck("String").appendField("say");
        this.setPreviousStatement(true, null); this.setNextStatement(true, null);
        this.setColour("#9966FF");
      }
    };

    javascriptGenerator.forBlock['motion_move'] = (block: any) => {
      const steps = javascriptGenerator.valueToCode(block, 'STEPS', (javascriptGenerator as any).ORDER_ATOMIC) || '0';
      return `move(${steps});\n`;
    };

    javascriptGenerator.forBlock['looks_say'] = (block: any) => {
      const text = javascriptGenerator.valueToCode(block, 'TEXT', (javascriptGenerator as any).ORDER_ATOMIC) || "''";
      return `say(${text});\n`;
    };

    const ws = Blockly.inject(blocklyRef.current, {
        renderer: 'zelos', // This activates the rounded Scratch UI
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

  useEffect(() => {
    if (!canvasParentRef.current) return;
    
    // CRITICAL: Remove the old canvas before making a new one
    if (p5Instance.current) {
      p5Instance.current.remove();
    }
  
    const sketch = (p: p5) => {
      let spriteImg: p5.Image | null = null;
      let bgImg: p5.Image | null = null;
      let capture: any;
  
      p.setup = () => {
        p.createCanvas(480, 360).parent(canvasParentRef.current!);
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER, p.CENTER);

        // Use a try-catch style approach for loading
        if (activeSprite.url && activeSprite.url.startsWith('http')) {
            p.loadImage(activeSprite.url, 
                img => { spriteImg = img; },
                (err) => { 
                  console.error("Sprite Load Failed:", err);
                  spriteImg = null; // Forces emoji fallback in draw()
                }
            );
        }
        
        if (activeBackdrop.img) {
            p.loadImage(activeBackdrop.img, 
                img => { bgImg = img; },
                () => { bgImg = null; }
            );
        }
      };
  
      p.draw = () => {
        // 1. Draw Colorful Backdrop
        if (bgImg) {
          p.image(bgImg, p.width/2, p.height/2, p.width, p.height);
        } else {
          // Junior Rainbow Gradient if no image
          p.background(activeBackdrop.color || '#FFDEE9');
        }
      
        // 2. Draw Sprite with "Bubbly" Effects
        p.push();
        const screenX = p.width/2 + engineState.current.x;
        const screenY = p.height/2 - engineState.current.y;
        p.translate(screenX, screenY);
        
        if (spriteImg) {
            p.image(spriteImg, 0, 0, engineState.current.size, engineState.current.size);
        } else {
            // MAGICAL FALLBACK: Big Emojis for Juniors
            p.textSize(engineState.current.size * 0.8);
            p.text(activeSprite.emoji || "🐱", 0, 0);
        }
      
        // 3. MAGIC SPEECH BUBBLE (Visual Fix)
        if (engineState.current.sayText) {
            p.push();
            p.fill(255);
            p.stroke('#4C97FF');
            p.strokeWeight(4);
            // Draw a rounded bubble
            p.rect(-60, -110, 120, 50, 20);
            // Draw the little tail
            p.triangle(-10, -60, 10, -60, 0, -40);
            
            p.noStroke();
            p.fill('#2D3748');
            p.textSize(16);
            p.text(engineState.current.sayText, 0, -85);
            p.pop();
        }
        p.pop();
      };
    };
  
    p5Instance.current = new p5(sketch);

    return () => {
        if (p5Instance.current) {
            p5Instance.current.remove();
        }
    };
  }, [activeSprite, activeBackdrop, isVideoOn]);

  const runCode = () => {
    if (!workspace) return;
    const code = javascriptGenerator.workspaceToCode(workspace);
    
    const move = (steps: number) => {
      engineState.current.x += steps;
    };
  
    const say = (text: string) => {
        // 1. Show bubble on screen
        engineState.current.sayText = text;
        // 2. Browser Voice Engine
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        // 3. Auto-hide bubble after 3 seconds
        setTimeout(() => {
          if (engineState.current) {
            engineState.current.sayText = "";
          }
        }, 3000);
    };
  
    try {
      const runner = new Function('move', 'say', code);
      runner(move, say);
    } catch (e) {
      console.error(e);
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
          <div className="w-[520px] p-4 flex flex-col gap-4 bg-[#F0F9FF] border-l-4 border-white overflow-y-auto z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.05)]">
            <div className="relative group">
                <div ref={canvasParentRef} className="rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white bg-white w-[480px] h-[360px]" />
                <Badge className="absolute top-4 left-4 bg-pink-500 text-white border-none shadow-lg">LIVE STAGE</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-[35px] shadow-sm border-b-8 border-blue-100">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Characters</p>
                    {canEdit && <AddAssetModal type="sprite" onAdded={refetchSprites} />}
                 </div>
                 <div className="flex gap-3 flex-wrap">
                    {sprites.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setActiveSprite(s)}
                        className={`w-16 h-16 text-4xl rounded-[20px] transition-all transform hover:scale-110 ${activeSprite.id === s.id ? 'bg-blue-500 shadow-lg scale-105' : 'bg-slate-50'}`}
                      >
                        {s.emoji}
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="bg-white p-5 rounded-[35px] shadow-sm border-b-8 border-pink-100">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Backdrops</p>
                    {canEdit && <AddAssetModal type="backdrop" onAdded={refetchBackdrops} />}
                 </div>
                 <div className="flex gap-3 flex-wrap">
                    {backdrops.map(b => (
                      <button 
                        key={b.id} 
                        onClick={() => setActiveBackdrop(b)}
                        className={`w-12 h-12 rounded-[16px] border-4 transition-all ${activeBackdrop.id === b.id ? 'border-pink-500 shadow-md scale-105' : 'border-white'}`}
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
