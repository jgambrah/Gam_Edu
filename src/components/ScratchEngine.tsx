
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import { 
  Play, Square, Image as ImageIcon, 
  User as UserIcon, Video, PlusCircle, Ghost, MousePointer2, Plus
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
  const [isVideoOn, setIsVideoOn] = useState(false);
  
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
    const SPRITE_LIBRARY = dbSprites?.length ? dbSprites : [
      { id: 'cat', emoji: '🐱', url: '/assets/sprites/cat.png', name: 'Cat' },
      { id: 'dog', emoji: '🐶', url: 'https://openclipart.org/image/2400px/svg_to_png/219213/Dog-Icon.png', name: 'Dog' },
      { id: 'rocket', emoji: '🚀', url: 'https://openclipart.org/image/2400px/svg_to_png/190875/Rocket-Icon.png', name: 'Rocket' },
    ];
    const BACKDROP_LIBRARY = dbBackdrops?.length ? dbBackdrops : [
      { id: 'white', color: '#FFFFFF', name: 'Plain', img: null },
      { id: 'blue-sky', color: '#87CEEB', name: 'Sky', img: null },
      { id: 'space', color: '#000033', name: 'Space', img: 'https://wallpaperaccess.com/full/1744011.jpg' },
      { id: 'jungle', color: '#228B22', name: 'Jungle', img: 'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_960_720.jpg' }
    ];

  const [activeSprite, setActiveSprite] = useState(SPRITE_LIBRARY[0]);
  const [activeBackdrop, setActiveBackdrop] = useState(BACKDROP_LIBRARY[0]);
  
  // Use 'engineState' everywhere
  const engineState = useRef({
    x: 0,
    y: 0,
    direction: 90,
    size: 100,
    sayText: "",
    isJunior: true // Helps trigger the colorful theme
  });

  const [sounds] = useState([
    { id: 'meow', emoji: '🐱', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
    { id: 'pop', emoji: '🎈', url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' },
  ]);

  useEffect(() => {
    if (!blocklyRef.current) return;

    // --- BLOCK DEFINITIONS ---
    Blockly.Blocks['motion_move'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("STEPS")
            .setCheck("Number")
            .appendField("move")
            .appendField("steps");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230); // Motion Blue
      }
    };
    
    Blockly.Blocks['motion_turnright'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("DEGREES").setCheck("Number").appendField("turn 👉"); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour(230); }
    };
    Blockly.Blocks['motion_goto'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("X").setCheck("Number").appendField("go to x:"); this.appendValueInput("Y").setCheck("Number").appendField("y:"); this.setInputsInline(true); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour(230); }
    };
    Blockly.Blocks['looks_changesizeby'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("CHANGE").setCheck("Number").appendField("change size by"); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour("#9966FF"); }
    };
    Blockly.Blocks['sound_play'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("SOUND").setCheck("String").appendField("play sound"); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour("#D65DB1"); }
    };
     Blockly.Blocks['control_if'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("IF0").setCheck("Boolean").appendField("if");
        this.appendStatementInput("DO0").appendField("then");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#FFAB19");
      }
    };
    Blockly.Blocks['control_repeat'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("TIMES").setCheck("Number").appendField("repeat"); this.appendStatementInput("DO").appendField("do"); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour("#FFAB19"); }
    };
    Blockly.Blocks['control_forever'] = {
        init: function(this: Blockly.Block) { this.appendDummyInput().appendField("forever"); this.appendStatementInput("DO"); this.setPreviousStatement(true, null); this.setColour("#FFAB19"); }
    };
    Blockly.Blocks['sensing_touchingmouse'] = {
        init: function(this: Blockly.Block) { this.appendDummyInput().appendField("touching mouse-pointer?"); this.setOutput(true, "Boolean"); this.setColour("#4CBFE6"); }
    };
    Blockly.Blocks['sensing_mousedown'] = {
        init: function(this: Blockly.Block) { this.appendDummyInput().appendField("mouse down?"); this.setOutput(true, "Boolean"); this.setColour("#4CBFE6"); }
    };
    Blockly.Blocks['operator_add'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("A").setCheck("Number"); this.appendValueInput("B").setCheck("Number").appendField("+"); this.setInputsInline(true); this.setOutput(true, "Number"); this.setColour("#40BF4A"); }
    };
    Blockly.Blocks['operator_random'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("FROM").setCheck("Number").appendField("pick random from"); this.appendValueInput("TO").setCheck("Number").appendField("to"); this.setInputsInline(true); this.setOutput(true, "Number"); this.setColour("#40BF4A"); }
    };
    Blockly.Blocks['operator_equals'] = {
        init: function(this: Blockly.Block) { this.appendValueInput("A"); this.appendValueInput("B").appendField("="); this.setInputsInline(true); this.setOutput(true, "Boolean"); this.setColour("#40BF4A"); }
    };
    Blockly.Blocks['looks_say'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("say");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#9966FF"); // Looks Purple
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
    Blockly.Blocks['control_wait'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("DURATION").setCheck("Number").appendField("wait").appendField("seconds");
        this.setPreviousStatement(true, null); this.setNextStatement(true, null);
        this.setColour("#FFAB19");
      }
    };
    Blockly.Blocks['event_whenflagclicked'] = {
      init: function(this: Blockly.Block) {
        this.appendDummyInput().appendField("when flag clicked 🚩");
        this.setNextStatement(true, null);
        this.setColour("#FFD500");
      }
    };

    // --- JAVASCRIPT GENERATORS ---
    javascriptGenerator.forBlock['motion_move'] = (block: any) => `move(${javascriptGenerator.valueToCode(block, 'STEPS', 0) || '0'});\n`;
    javascriptGenerator.forBlock['looks_say'] = (block: any) => `say(${javascriptGenerator.valueToCode(block, 'TEXT', 0) || "''"});\n`;
    javascriptGenerator.forBlock['video_toggle'] = (block: any) => `toggleVideo("${block.getFieldValue('STATE')}");\n`;
    javascriptGenerator.forBlock['control_wait'] = (block: any) => {
        const duration = javascriptGenerator.valueToCode(block, 'DURATION', 0) || '1';
        return `await wait(${duration});\n`; // We use async/await for smooth timing
    };
    javascriptGenerator.forBlock['event_whenflagclicked'] = () => ""; // The runner starts execution
    javascriptGenerator.forBlock['motion_turnright'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['motion_goto'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['looks_changesizeby'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['sound_play'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['control_if'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['control_repeat'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['control_forever'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['sensing_touchingmouse'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['sensing_mousedown'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['operator_add'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['operator_random'] = (block: any) => `\n`;
    javascriptGenerator.forBlock['operator_equals'] = (block: any) => `\n`;


    const toolbox = `
      <xml>
        <category name="Events" colour="#FFD500">
          <block type="event_whenflagclicked"></block>
        </category>
        <category name="Motion" colour="#4C97FF">
          <block type="motion_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
          <block type="motion_turnright"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block>
          <block type="motion_goto"><value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>
        </category>
        <category name="Looks" colour="#9966FF">
          <block type="looks_say"><value name="TEXT"><shadow type="text"><field name="TEXT">Hello!</field></shadow></value></block>
          <block type="looks_changesizeby"><value name="CHANGE"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
        </category>
        <category name="Sound" colour="#D65DB1">
          <block type="sound_play"><value name="SOUND"><shadow type="text"><field name="TEXT">meow</field></shadow></value></block>
        </category>
        <category name="Control" colour="#FFAB19">
          <block type="control_wait"><value name="DURATION"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>
          <block type="control_repeat"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
          <block type="control_forever"></block>
          <block type="control_if"></block>
        </category>
        <category name="Sensing" colour="#4CBFE6">
          <block type="sensing_touchingmouse"></block>
          <block type="sensing_mousedown"></block>
          <block type="video_toggle"></block>
        </category>
        <category name="Operators" colour="#40BF4A">
          <block type="operator_add"></block>
          <block type="operator_random"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>
          <block type="operator_equals"></block>
        </category>
        <category name="Variables" colour="#FF8C1A" custom="VARIABLE"></category>
        <category name="My Blocks" colour="#FF6680" custom="PROCEDURE"></category>
        <sep></sep>
        <category name="Pen" colour="#00B295">
          <block type="pen_clear"></block>
          <block type="pen_pendown"></block>
          <block type="pen_penup"></block>
          <block type="pen_setcolor">
            <value name="COLOR">
              <shadow type="colour_picker"></shadow>
            </value>
          </block>
          <block type="pen_setsize">
            <value name="SIZE">
              <shadow type="math_number"><field name="NUM">1</field></shadow>
            </value>
          </block>
        </category>
      </xml>
    `;

    const ws = Blockly.inject(blocklyRef.current, {
        renderer: 'zelos',
        toolbox: toolbox,
      });
    setWorkspace(ws);
    return () => ws.dispose();
  }, []);

  useEffect(() => {
    if (!canvasParentRef.current) return;
  
    if (p5Instance.current) {
      p5Instance.current.remove();
    }
  
    const sketch = (p: p5) => {
      let spriteImg: p5.Image | null = null;
      let bgImg: p5.Image | null = null;
      let capture: p5.Element | null = null;
  
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
        // 1. Draw Background
        if (bgImg) {
          p.image(bgImg, p.width/2, p.height/2, p.width, p.height);
        } else {
          p.background(activeBackdrop.color || '#F0F9FF');
        }

        // 2. NEW: VIDEO SENSING LAYER
        if (isVideoOn) {
          if (!capture) {
            capture = p.createCapture(p.VIDEO);
            (capture as any).size(480, 360);
            capture.hide(); // Hide the extra video element below the canvas
          }
          p.push();
          p.translate(p.width, 0); 
          p.scale(-1, 1); // Mirror the video so it feels natural
          p.tint(255, 120); // Make it ghostly/transparent like Scratch
          p.image(capture, p.width/2, p.height/2, p.width, p.height);
          p.pop();
        } else {
          // If video is turned off, stop the stream to save battery/cpu
          if (capture) {
            (capture as any).stop();
            capture = null;
          }
        }

        // 3. Draw Sprite (as before)
        p.push();
        const screenX = p.width/2 + engineState.current.x;
        const screenY = p.height/2 - engineState.current.y;
        p.translate(screenX, screenY);
        
        if (spriteImg) {
            p.image(spriteImg, 0, 0, engineState.current.size, engineState.current.size);
        } else {
            p.textSize(engineState.current.size * 0.8);
            p.text(activeSprite.emoji || "🐱", 0, 0);
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

  const runCode = async () => {
    // Generate code and wrap it in an async function
    if (!workspace) return;
    const rawCode = javascriptGenerator.workspaceToCode(workspace);
    
    // Scoped helper functions
    const move = (steps: number) => { engineState.current.x += steps; };
    
    const say = (text: string) => {
      engineState.current.sayText = text;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      // Bubbles disappear after 2 seconds
      setTimeout(() => { 
        if (engineState.current) engineState.current.sayText = "";
      }, 2000);
    };
  
    const wait = (seconds: number) => new Promise(res => setTimeout(res, seconds * 1000));

    // Execution environment (Injects variables and sensing data)
    const context = {
      move,
      say,
      wait,
      mouseX: p5Instance.current?.mouseX || 0,
      mouseY: p5Instance.current?.mouseY || 0,
    };
  
    try {
      // Create an Async function to allow 'await wait()'
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const runner = new AsyncFunction(...Object.keys(context), rawCode);
      await runner(...Object.values(context));
    } catch (e) {
      console.error("Execution Error:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] overflow-hidden">
      {/* 1. Header */}
      <div className="bg-[#4C97FF] p-3 flex justify-between items-center text-white z-50 shadow-md">
         <h1 className="text-xl font-black italic ml-4">ACADEMY STUDIO</h1>
         <div className="flex gap-2">
           <Button onClick={runCode} className="bg-[#4dc94d] rounded-full h-10 px-8">▶ GO</Button>
           <Button onClick={() => window.location.reload()} variant="destructive" className="h-10 w-10">■</Button>
         </div>
      </div>
  
      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. Coding Workspace */}
        <div className="flex-1 h-full relative bg-white">
          {/* Visual Guide for students */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 flex flex-col items-center">
              <MousePointer2 className="w-20 h-20 mb-4" />
              <p className="text-4xl font-black uppercase">Drag Blocks Here</p>
          </div>
          <div ref={blocklyRef} className="absolute inset-0 w-full h-full" />
        </div>
  
        {/* RIGHT: STAGE & ASSETS (Separated with high z-index) */}
        <div className="w-[520px] p-4 flex flex-col gap-4 bg-[#F0F9FF] border-l-4 border-white overflow-y-auto z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.05)]">
          
          {/* The Stage */}
          <div className="relative group">
            <div ref={canvasParentRef} className="rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white bg-white w-[480px] h-[360px]" />
            <Badge className="absolute top-4 left-4 bg-pink-500 text-white border-none shadow-lg">LIVE STAGE</Badge>
          </div>

          {/* MAGIC MIRROR (VIDEO SENSING) */}
          <div className="bg-white p-5 rounded-[35px] shadow-sm border-b-8 border-purple-100 flex justify-between items-center animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-2xl">
                  <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-none mb-1">Magic Mirror</p>
                  <p className="text-sm font-bold text-slate-700">Video Sensing</p>
              </div>
            </div>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`px-6 py-2 rounded-full text-xs font-black transition-all transform active:scale-95 ${
                isVideoOn 
                  ? 'bg-purple-500 text-white shadow-[0_4px_0_#7e22ce]' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {isVideoOn ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <span className="text-[10px] font-black uppercase text-pink-400 mb-3 block">Sound Library</span>
              <div className="flex gap-2">
                  {sounds.map(s => (
                  <button 
                      key={s.id} 
                      onClick={() => new Audio(s.url).play()}
                      className="p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                  >
                      {s.emoji} <span className="text-[10px] font-bold text-pink-600">{s.id}</span>
                  </button>
                  ))}
              </div>
          </div>

          {/* ASSET SELECTORS (Colorful "Magic Card" style) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[35px] shadow-sm border-b-8 border-blue-100">
               <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Characters</p>
                  {canEdit && <AddAssetModal type="sprite" onAdded={refetchSprites} />}
               </div>
               <div className="flex gap-3 flex-wrap">
                  {SPRITE_LIBRARY.map(s => (
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
                    {BACKDROP_LIBRARY.map(b => (
                        <button 
                        key={b.id} 
                        onClick={() => setActiveBackdrop(b)}
                        className={`w-12 h-12 rounded-[16px] border-4 transition-all ${activeBackdrop.id === b.id ? 'border-pink-500 shadow-md scale-105' : 'border-white'}`}
                        style={{ backgroundColor: b.color, backgroundImage: `url(${b.img})`, backgroundSize: 'cover' }}
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
