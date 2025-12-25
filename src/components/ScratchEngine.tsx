
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { 
  Play, Square, Image as ImageIcon, 
  User as UserIcon, Video, Volume2, Plus, Trash2, Move, Ghost
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRole } from '@/context/role-context';

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

  // Determine if the user has editing rights
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
  
  // Internal Engine State
  const engineState = useRef({
    x: 0,
    y: 0,
    direction: 90,
    size: 80,
    sayText: ""
  });

  // --- BLOCKLY SETUP ---
  useEffect(() => {
    if (!blocklyRef.current) return;

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
            <block type="motion_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
          </category>
          <category name="Looks" colour="#9966FF">
             <block type="looks_say"><value name="TEXT"><shadow type="text"><field name="TEXT">Hello!</field></shadow></value></block>
          </category>
        </xml>
      `,
    });
    setWorkspace(ws);
    return () => ws.dispose();
  }, []);

  // --- P5.JS ENGINE ---
  useEffect(() => {
    if (!canvasParentRef.current) return;

    const sketch = (p: p5) => {
      let spriteImg: p5.Image;
      let bgImg: p5.Image | null = null;
      let capture: any;

      p.preload = () => {
        if (activeSprite.url) {
          p.loadImage(activeSprite.url, img => spriteImg = img, () => console.log("Sprite Load Failed"));
        }
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
        else p.background(activeBackdrop.color || '#FFFFFF');
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

    const instance = new p5(sketch);
    return () => instance.remove();
  }, [activeSprite, activeBackdrop, isVideoOn]);

  // --- ENGINE CONTROLS ---
  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    const move = (steps: number) => engineState.current.x += steps;
    const say = (text: string) => {
        engineState.current.sayText = text;
        setTimeout(() => engineState.current.sayText = "", 3000);
    };
    try {
      new Function('move', 'say', code)(move, say);
    } catch (e) {
      toast({ title: "Code Error", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-slate-100">
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* BLOCKLY WORKSPACE */}
        <div ref={blocklyRef} className="flex-1 h-full rounded-lg shadow-md bg-white" />

        {/* STAGE AREA */}
        <div className="w-[500px] flex flex-col gap-4">
          <div ref={canvasParentRef} className="rounded-xl shadow-2xl border-4 border-white bg-white overflow-hidden w-[480px] h-[360px]" />
            <div className="grid grid-cols-2 gap-4">
            {/* SPRITE SELECTOR */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-slate-400">Sprites</span>
                    {canEdit && <AddAssetModal type="sprite" onAdded={refetchSprites} />}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {sprites.map(s => (
                        <button key={s.id} onClick={() => setActiveSprite(s)}
                            className={`w-12 h-12 text-3xl rounded-2xl border-2 transition-all ${activeSprite.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}
                        >
                            {s.emoji || '📦'}
                        </button>
                    ))}
                </div>
            </div>

            {/* BACKDROP SELECTOR */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-slate-400">Backdrops</span>
                    {canEdit && <AddAssetModal type="backdrop" onAdded={refetchBackdrops} />}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {backdrops.map(b => (
                    <button key={b.id} onClick={() => setActiveBackdrop(b)}
                        className={`w-10 h-10 rounded-md border-2 transition-all ${activeBackdrop.id === b.id ? 'border-blue-500 shadow-md' : 'border-slate-200'}`}
                        style={{ backgroundColor: b.color }}
                    />
                    ))}
                </div>
            </div>
            </div>

          {/* VIDEO CONTROL */}
          <div className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
            <span className="text-xs font-bold text-slate-600">Video Sensing</span>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isVideoOn ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}
            >
              {isVideoOn ? 'ON' : 'OFF'}
            </button>
          </div>

          <Button onClick={runCode} className="w-full h-14 bg-green-500 hover:bg-green-600 text-lg font-bold shadow-lg">
            <Play className="mr-2 fill-current" /> RUN
          </Button>
        </div>
      </div>
    </div>
  );
}

  