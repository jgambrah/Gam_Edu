
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { 
  Play, Square, Image as ImageIcon, 
  User as UserIcon, Video, Volume2, Plus, Trash2, Move, Ghost, MousePointer2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRole } from '@/context/role-context';
import { Badge } from '@/components/ui/badge';

// --- ADD ASSET MODAL ---
function AddAssetModal({ type, onAdded }: { type: 'sprite' | 'backdrop', onAdded: () => void }) {
    const firestore = useFirestore();
    const [form, setForm] = useState({ name: '', emoji: '', url: '', color: '#FFFFFF' });
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = async () => {
        if (!firestore || !form.name) {
            alert("Name is required.");
            return;
        }
        await addDoc(collection(firestore, 'scratch_assets'), {
            ...form,
            type: type,
            createdAt: serverTimestamp()
        });
        onAdded(); // This will trigger forceRefetch
        setIsOpen(false); // Close the dialog
        alert(`${type} Added Successfully!`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-blue-100 text-blue-600 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[30px]">
                <DialogHeader>
                    <DialogTitle>Add New {type}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                    <Input placeholder="Name (e.g. Dragon)" onChange={e => setForm({...form, name: e.target.value})} />
                    {type === 'sprite' && <Input placeholder="Emoji (e.g. 🐉)" onChange={e => setForm({...form, emoji: e.target.value})} />}
                    <Input placeholder="Image URL (e.g. /assets/dragon.png)" onChange={e => setForm({...form, url: e.target.value})} />
                    {type === 'backdrop' && (
                        <div className="flex items-center gap-4">
                            <Label>Background Color</Label>
                            <input type="color" defaultValue="#FFFFFF" onChange={e => setForm({...form, color: e.target.value})} />
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
  const [isVideoOn, setIsVideoOn] = useState(false);
  const p5Instance = useRef<p5 | null>(null);
  const { toast } = useToast();
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
    { id: 'cat', emoji: '🐱', url: '/assets/sprites/cat.png', name: 'Cat' }
  ];
  const backdrops = dbBackdrops?.length ? dbBackdrops : [
    { id: 'white', color: '#FFFFFF', name: 'Plain', img: null }
  ];
  
  const [activeSprite, setActiveSprite] = useState(sprites[0]);
  const [activeBackdrop, setActiveBackdrop] = useState(backdrops[0]);
  
  // Internal Engine State (Shared between Blockly and p5)
  const engineState = useRef({
    x: 0,
    y: 0,
    direction: 90,
    size: 80,
    sayText: ""
  });

  // --- 2. BLOCKLY DEFINITIONS (ZELOS) ---
  useEffect(() => {
    if (!blocklyRef.current) return;

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
        this.setColour("#FF6680");
      }
    };
     Blockly.Blocks['video_toggle'] = {
      init: function(this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("turn video")
            .appendField(new Blockly.FieldDropdown([["on","ON"], ["off","OFF"]]), "STATE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#CF63CF"); // Sensing Purple
      }
    };
    javascriptGenerator.forBlock['motion_move'] = (block) => {
      const steps = javascriptGenerator.valueToCode(block, 'STEPS', 0) || '0';
      return `move(${steps});\n`;
    };
    javascriptGenerator.forBlock['speech_speak'] = (block) => {
      const text = javascriptGenerator.valueToCode(block, 'TEXT', 0) || "''";
      return `speakText(${text});\n`;
    };
    javascriptGenerator.forBlock['video_toggle'] = function(block) {
      const state = block.getFieldValue('STATE');
      return `toggleVideo("${state}");\n`;
    };

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
           <category name="Sensing" colour="#CF63CF">
            <block type="video_toggle"></block>
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

    const sketch = (p: p5) => {
      let spriteImg: p5.Image;
      let bgImg: p5.Image | null = null;
      let capture: any;

      p.preload = () => {
        p.loadImage(activeSprite.url, img => spriteImg = img, () => console.log("Sprite Load Failed"));
        if (activeBackdrop.img) {
          p.loadImage(activeBackdrop.img, img => bgImg = img, () => console.log("Backdrop Load Failed"));
        }
      };

      p.setup = () => {
        p.createCanvas(480, 360).parent(canvasParentRef.current!);
        p.imageMode(p.CENTER);
      };

      p.draw = () => {
        if (bgImg) p.image(bgImg, p.width/2, p.height/2, p.width, p.height);
        else p.background(activeBackdrop.color);

        if (isVideoOn) {
          if (!capture) { capture = p.createCapture(p.VIDEO); capture.hide(); }
          p.push();
          p.translate(p.width, 0); p.scale(-1, 1);
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

    const instance = new p5(sketch);
    return () => instance.remove();
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
    const toggleVideo = (state: string) => setIsVideoOn(state === 'ON');

    try {
      const runner = new Function('move', 'say', 'toggleVideo', code);
      runner(move, say, toggleVideo);
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
            
            {/* Asset Library Panels */}
            <div className="grid grid-cols-2 gap-3">
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
                      className={`w-12 h-12 text-3xl rounded-xl border-2 transition-all ${activeSprite.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}
                    >
                      {s.emoji || '📦'}
                    </button>
                  ))}
                </div>
              </div>

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
                      className={`w-10 h-10 rounded-lg border-2 shadow-sm ${activeBackdrop.id === b.id ? 'border-blue-500' : 'border-white'}`}
                      style={{ backgroundColor: b.color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg"><Video className="w-5 h-5 text-purple-600"/></div>
                  <span className="font-bold text-slate-600">Video Sensing</span>
                </div>
                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`px-6 py-2 rounded-full text-xs font-black transition-all ${isVideoOn ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                >
                  {isVideoOn ? 'ON' : 'OFF'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
