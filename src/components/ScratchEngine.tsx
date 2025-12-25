
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Code2, FolderOpen, Save, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from 'canvas-confetti';

// --- IMPORTS FOR PLUGINS ---
import { installAllBlocks as installColourBlocks } from '@blockly/field-colour';
import multiLineEditor from '@blockly/field-multilineinput';

// Register the plugins
installColourBlocks({
  javascript: javascriptGenerator,
});


// --- 1. DEFINE CUSTOM BLOCKS (Optional) ---
Blockly.Blocks['get_science_fact'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput().appendField("🧪 get science fact");
    this.setOutput(true, 'String');
    this.setColour(230);
    this.setTooltip("Fetches a random science fact.");
  }
};

javascriptGenerator.forBlock['get_science_fact'] = function(block: Blockly.Block) {
  const facts = [
      "The mitochondria is the powerhouse of the cell.",
      "Honey never spoils.",
      "Octopuses have three hearts.",
      "Bananas are curved because they grow towards the sun.",
      "Water can boil and freeze at the same time."
  ];
  const code = `[${facts.map(f => `'${f}'`).join(',')}] [Math.floor(Math.random() * ${facts.length})]`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

// --- 2. EXHAUSTIVE TOOLBOX CONFIGURATION ---
const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
      // 🚀 MOTION
      {
        kind: 'category',
        name: 'Motion',
        colour: '#4C97FF',
        contents: [
          { kind: 'block', type: 'motion_move' },
          { kind: 'block', type: 'motion_turnright' },
          { kind: 'block', type: 'motion_goto' },
        ],
      },
      // 👀 LOOKS
      {
        kind: 'category',
        name: 'Looks',
        colour: '#9966FF',
        contents: [
          { kind: 'block', type: 'looks_say' },
          { kind: 'block', type: 'looks_changesizeby' },
        ],
      },
      // 🔊 SOUND
      {
        kind: 'category',
        name: 'Sound',
        colour: '#D65DB1',
        contents: [
           { kind: 'block', type: 'sound_play' },
        ]
      },
       // 🎬 EVENTS
      {
        kind: 'category',
        name: 'Events',
        colour: '#FFD500',
        contents: [
           { kind: 'block', type: 'event_whenflagclicked' },
        ]
      },
      // 🔄 CONTROL
       {
        kind: 'category',
        name: 'Control',
        colour: '#FFAB19',
        contents: [
           { kind: 'block', type: 'control_wait' },
           { kind: 'block', type: 'control_repeat' },
           { kind: 'block', type: 'control_if' },
           { kind: 'block', type: 'control_forever' },
        ]
      },
      // 👁️ SENSING
       {
        kind: 'category',
        name: 'Sensing',
        colour: '#4CBFE6',
        contents: [
           { kind: 'block', type: 'sensing_touchingmouse' },
           { kind: 'block', type: 'sensing_mousedown' },
        ]
      },
      // ➕ OPERATORS
       {
        kind: 'category',
        name: 'Operators',
        colour: '#40BF4A',
        contents: [
           { kind: 'block', type: 'operator_add' },
           { kind: 'block', type: 'operator_random' },
           { kind: 'block', type: 'operator_equals' },
        ]
      },
      // ✍️ PEN
      {
        kind: 'category',
        name: 'Pen',
        colour: '#00B295',
        contents: [
          { kind: 'block', type: 'pen_clear' },
          { kind: 'block', type: 'pen_pendown' },
          { kind: 'block', type: 'pen_penup' },
          {
            kind: 'block',
            type: 'pen_setcolor',
            inputs: {
              COLOR: { shadow: { type: 'colour_picker' } }
            }
          },
          {
            kind: 'block',
            type: 'pen_setsize',
            inputs: {
              SIZE: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
            }
          },
        ],
      },
      // 🎨 COLOUR
      {
        kind: 'category',
        name: 'Colour',
        colour: '%{BKY_COLOUR_HUE}',
        contents: [
          { kind: 'block', type: 'colour_picker' },
          { kind: 'block', type: 'colour_random' },
          { kind: 'block', type: 'colour_rgb' },
        ],
      },
      { kind: 'sep' },
      // 📦 VARIABLES
      {
        kind: 'category',
        name: 'Variables',
        colour: '%{BKY_VARIABLES_HUE}',
        custom: 'VARIABLE',
      },
      // ⚙️ FUNCTIONS / MY BLOCKS
      {
        kind: 'category',
        name: 'My Blocks',
        colour: '%{BKY_PROCEDURES_HUE}',
        custom: 'PROCEDURE',
      },
      { kind: 'sep' },
      // 🚀 EXTRAS
      {
        kind: 'category',
        name: 'Extra',
        colour: '230',
        contents: [
          { kind: 'block', type: 'get_science_fact' },
        ],
      },
    ]
};

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
    prevX: 0,
    prevY: 0,
    direction: 90,
    size: 100,
    sayText: "",
    isPenDown: false,
    penColor: '#000000',
    penSize: 2,
    shouldClearPen: false, // Flag to trigger clearing
    isJunior: true 
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
    Blockly.Blocks['looks_say'] = {
      init: function(this: Blockly.Block) {
        this.appendValueInput("TEXT").setCheck("String").appendField("say");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#9966FF");
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
      init: function(this: Blockly.Block) { this.appendValueInput("IF0").setCheck("Boolean").appendField("if"); this.appendStatementInput("DO0").appendField("then"); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour("#FFAB19"); }
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
      init: function(this: Blockly.Block) { this.appendValueInput("A"); this.appendValueInput("B").setCheck("Number").appendField("+"); this.setInputsInline(true); this.setOutput(true, "Number"); this.setColour("#40BF4A"); }
    };
    
    Blockly.Blocks['operator_random'] = {
      init: function(this: Blockly.Block) { this.appendValueInput("FROM").setCheck("Number").appendField("pick random from"); this.appendValueInput("TO").setCheck("Number").appendField("to"); this.setInputsInline(true); this.setOutput(true, "Number"); this.setColour("#40BF4A"); }
    };
    
    Blockly.Blocks['operator_equals'] = {
      init: function(this: Blockly.Block) { this.appendValueInput("A"); this.appendValueInput("B").appendField("="); this.setInputsInline(true); this.setOutput(true, "Boolean"); this.setColour("#40BF4A"); }
    };
    
    Blockly.Blocks['pen_clear'] = { init: function() { this.appendDummyInput().appendField("erase all"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#00B295"); } };
    Blockly.Blocks['pen_pendown'] = { init: function() { this.appendDummyInput().appendField("pen down"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#00B295"); } };
    Blockly.Blocks['pen_penup'] = { init: function() { this.appendDummyInput().appendField("pen up"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#00B295"); } };
    Blockly.Blocks['pen_setcolor'] = { init: function(this: Blockly.Block) { this.appendValueInput('COLOR').setCheck('Colour').appendField('set pen color to'); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour('#00B295'); } };
    Blockly.Blocks['pen_setsize'] = { init: function(this: Blockly.Block) { this.appendValueInput('SIZE').setCheck('Number').appendField('set pen size to'); this.setPreviousStatement(true, null); this.setNextStatement(true, null); this.setColour('#00B295'); } };
    Blockly.Blocks['colour_random'] = { init: function(this: Blockly.Block) { this.appendDummyInput().appendField('random colour'); this.setOutput(true, 'Colour'); this.setColour('%{BKY_COLOUR_HUE}'); } };
    Blockly.Blocks['colour_rgb'] = { init: function(this: Blockly.Block) { this.appendValueInput("RED").setCheck("Number").appendField("colour with red"); this.appendValueInput("GREEN").setCheck("Number").appendField("green"); this.appendValueInput("BLUE").setCheck("Number").appendField("blue"); this.setInputsInline(true); this.setOutput(true, "Colour"); this.setColour('%{BKY_COLOUR_HUE}'); } };
    

    // --- JAVASCRIPT GENERATORS ---
    javascriptGenerator.forBlock['motion_move'] = (block: any) => `move(${javascriptGenerator.valueToCode(block, 'STEPS', 0) || '0'});\n`;
    javascriptGenerator.forBlock['looks_say'] = (block: any) => `say(${javascriptGenerator.valueToCode(block, 'TEXT', 0) || "''"});\n`;
    javascriptGenerator.forBlock['video_toggle'] = (block: any) => `toggleVideo("${block.getFieldValue('STATE')}");\n`;
    javascriptGenerator.forBlock['control_wait'] = (block: any) => `await wait(${javascriptGenerator.valueToCode(block, 'DURATION', 0) || '1'});\n`;
    javascriptGenerator.forBlock['event_whenflagclicked'] = () => "";
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
    javascriptGenerator.forBlock['pen_clear'] = () => `penClear();\n`;
    javascriptGenerator.forBlock['pen_pendown'] = () => `setPen(true);\n`;
    javascriptGenerator.forBlock['pen_penup'] = () => `setPen(false);\n`;
    javascriptGenerator.forBlock['pen_setcolor'] = (b: any) => `setPenColor(${javascriptGenerator.valueToCode(b, 'COLOR', 0) || "'#000000'"});\n`;
    javascriptGenerator.forBlock['pen_setsize'] = (b: any) => `setPenSize(${javascriptGenerator.valueToCode(b, 'SIZE', 0) || 1});\n`;
    javascriptGenerator.forBlock['colour_random'] = () => `randomColor();\n`;
    javascriptGenerator.forBlock['colour_rgb'] = (b: any) => `rgbToHex(${javascriptGenerator.valueToCode(b, 'RED', 0) || 0}, ${javascriptGenerator.valueToCode(b, 'GREEN', 0) || 0}, ${javascriptGenerator.valueToCode(b, 'BLUE', 0) || 0});\n`;
    

    const ws = Blockly.inject(blocklyRef.current, {
        renderer: 'zelos',
        toolbox: toolboxCategories,
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
      let extraCanvas: p5.Graphics;
      let spriteImg: p5.Image | null = null;
      let bgImg: p5.Image | null = null;
      let capture: p5.Element | null = null;
  
      p.setup = () => {
        p.createCanvas(480, 360).parent(canvasParentRef.current!);
        extraCanvas = p.createGraphics(480, 360);
        extraCanvas.clear();
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER, p.CENTER);
      
        if (activeSprite.url && activeSprite.url.startsWith('http')) {
            p.loadImage(activeSprite.url, 
                img => { spriteImg = img; },
                (err) => { 
                  console.error("Sprite Load Failed:", err);
                  spriteImg = null;
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

        // NEW: Check if we need to clear the pen layer
        if (engineState.current.shouldClearPen) {
            extraCanvas.clear();
            engineState.current.shouldClearPen = false;
        }

        // 2. Draw the Pen Layer on top of the background
        p.image(extraCanvas, p.width/2, p.height/2);

        // 3. Logic: If pen is down, draw a line on extraCanvas
        if (engineState.current.isPenDown) {
            extraCanvas.stroke(engineState.current.penColor || '#000');
            extraCanvas.strokeWeight(engineState.current.penSize || 2);
            // Draw from old position to new position
            extraCanvas.line(
                p.width/2 + engineState.current.prevX, 
                p.height/2 - engineState.current.prevY,
                p.width/2 + engineState.current.x,
                p.height/2 - engineState.current.y
            );
        }
        
        // Update "previous" position for the next frame
        engineState.current.prevX = engineState.current.x;
        engineState.current.prevY = engineState.current.y;

        // 4. VIDEO SENSING LAYER
        if (isVideoOn) {
          if (!capture) {
            capture = p.createCapture(p.VIDEO);
            (capture as any).size(480, 360);
            capture.hide();
          }
          p.push();
          p.translate(p.width, 0); 
          p.scale(-1, 1);
          p.tint(255, 120);
          p.image(capture, p.width/2, p.height/2, p.width, p.height);
          p.pop();
        } else {
          if (capture) {
            (capture as any).stop();
            capture = null;
          }
        }
      
        // 5. Draw Sprite
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

    const toggleVideo = (state: 'ON' | 'OFF') => setIsVideoOn(state === 'ON');

    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

    const rgbToHex = (r: number, g: number, b: number) => `#${[r,g,b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  
    // Execution environment (Injects variables and sensing data)
    const context = {
        move,
        say,
        wait,
        toggleVideo,
        mouseX: p5Instance.current?.mouseX || 0,
        mouseY: p5Instance.current?.mouseY || 0,
        setPen: (isDown: boolean) => { engineState.current.isPenDown = isDown; },
        penClear: () => { engineState.current.shouldClearPen = true; },
        setPenColor: (color: string) => { engineState.current.penColor = color; },
        setPenSize: (size: number) => { engineState.current.penSize = Math.max(1, size); },
        randomColor,
        rgbToHex
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 flex flex-col items-center">
              <MousePointer2 className="w-20 h-20 mb-4" />
              <p className="text-4xl font-black uppercase">Drag Blocks Here</p>
          </div>
          <div ref={blocklyRef} className="absolute inset-0 w-full h-full" />
        </div>
  
        {/* RIGHT: STAGE & ASSETS */}
        <div className="w-[520px] p-4 flex flex-col gap-4 bg-[#F0F9FF] border-l-4 border-white overflow-y-auto z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.05)]">
          
          <div className="relative group">
            <div ref={canvasParentRef} className="rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white bg-white w-[480px] h-[360px]" />
            <Badge className="absolute top-4 left-4 bg-pink-500 text-white border-none shadow-lg">LIVE STAGE</Badge>
          </div>

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
