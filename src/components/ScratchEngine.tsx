
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import p5 from 'p5';
import {
  Play,
  Square,
  Image as ImageIcon,
  User as UserIcon,
  Video,
  PlusCircle,
  Ghost,
  MousePointer,
  Plus,
  Trash2,
  FolderOpen,
  Save,
  RotateCcw,
  Bot,
  HelpCircle,
  Palette,
  Droplet,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/context/role-context';
import { registerCustomBlocks } from '@/lib/blockly/custom-blocks';

registerCustomBlocks();

// --- 1. ASSET LIBRARIES ---
const SPRITE_LIBRARY = [
  { 
    id: 'cat', 
    name: 'Cat', 
    emoji: '🐱', 
    costumes: [
      'https://api.scratch.mit.edu/internalapi/asset/b7853f557e4433722f86233346394526.svg/get/',
      'https://api.scratch.mit.edu/internalapi/asset/2e9063c64a36371b63574b5379e43d70.svg/get/'
    ]
  },
  { 
    id: 'ghost', 
    name: 'Ghost', 
    emoji: '👻', 
    costumes: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7']
  },
  { 
    id: 'rocket', 
    name: 'Rocket', 
    emoji: '🚀', 
    costumes: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7']
  }
];
const DEFAULT_BACKDROPS = [
  { id: 'blue-sky', name: 'Blue Sky', color: '#87CEEB', url: '' },
  { id: 'space', name: 'Space', color: '#000033', url: 'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_960_720.jpg' },
  { id: 'grid', name: 'Grid', color: '#FFFFFF', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Grid_from_the_Noun_Project.svg/2000px-Grid_from_the_Noun_Project.svg.png' }
];

const SOUND_LIBRARY = [
      { id: 'meow', label: 'Meow 🐱', url: 'https://cdn.freesound.org/previews/256/256339_4030635-lq.mp3' },
      { id: 'pop', label: 'Pop 🎈', url: 'https://cdn.freesound.org/previews/511/511484_10825312-lq.mp3' }
    ];


const ScratchEngine = () => {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const [sprites, setSprites] = useState(SPRITE_LIBRARY);
    const [backdrops, setBackdrops] = useState(DEFAULT_BACKDROPS);
    const [activeSprite, setActiveSprite] = useState(SPRITE_LIBRARY[0]);
    const [activeBackdrop, setActiveBackdrop] = useState(DEFAULT_BACKDROPS[0]);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: p5.Image }>({});
    
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const p5ContainerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    const engineState = useRef({
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        direction: 90, // 0 is right, 90 is up
        size: 100, // percentage
        message: '',
        messageDuration: 0,
        isPenDown: false,
        penColor: '#000000',
        shouldClear: false,
        costumeIndex: 0
    });

    // Blockly state
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const [xml, setXml] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');

    const { workspace } = useBlocklyWorkspace({
        ref: blocklyDivRef,
        toolboxConfiguration: {
            kind: 'categoryToolbox',
            contents: [
                { kind: 'category', name: 'Events', colour: '#FFD500', contents: [ { kind: 'block', type: 'event_whenflagclicked' } ] },
                { kind: 'category', name: 'Motion', colour: '#4C97FF', contents: [
                    { kind: 'block', type: 'motion_move', inputs: { STEPS: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                    { kind: 'block', type: 'motion_turnright', inputs: { DEGREES: { shadow: { type: 'math_number', fields: { NUM: 15 } } } } }
                ]},
                { kind: 'category', name: 'Looks', colour: '#9966FF', contents: [
                    { kind: 'block', type: 'looks_sayforsecs', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } }, SECS: { shadow: { type: 'math_number', fields: { NUM: 2 } } } } },
                    { kind: 'block', type: 'looks_say', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
                    { kind: 'block', type: 'looks_thinkforsecs', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hmm...' } } }, SECS: { shadow: { type: 'math_number', fields: { NUM: 2 } } } } },
                    { kind: 'block', type: 'looks_think', inputs: { MESSAGE: { shadow: { type: 'text', fields: { TEXT: 'Hmm...' } } } } },
                    { kind: 'block', type: 'looks_changesizeby', inputs: { CHANGE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                    { kind: 'block', type: 'looks_setsizeto', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
                    { kind: 'block', type: 'looks_nextcostume' }
                ]},
                { kind: 'category', name: 'Sound', colour: '#CF63CF', contents: [
                    { kind: 'block', type: 'sound_playuntildone', inputs: { SOUND_MENU: { shadow: { type: 'sound_sounds_menu' }}}},
                ]},
                { kind: 'category', name: 'Control', colour: '#FFAB19', contents: [
                    { kind: 'block', type: 'control_wait', inputs: { DURATION: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
                    { kind: 'block', type: 'control_repeat', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                    { kind: 'block', type: 'control_forever' }
                ]},
                { kind: 'category', name: 'Sensing', colour: '#4CBFE6', contents: [{ kind: 'block', type: 'sensing_touchingmouse' }] },
                { kind: 'category', name: 'Operators', colour: '#40BF4A', contents: [{ kind: 'block', type: 'operator_random' }] },
                { kind: 'category', name: 'Pen', colour: '#00B295', contents: [
                    { 'kind': 'block', 'type': 'pen_clear' },
                    { 'kind': 'block', 'type': 'pen_stamp' },
                    { 'kind': 'block', 'type': 'pen_penDown' },
                    { 'kind': 'block', 'type': 'pen_penUp' },
                    { 'kind': 'block', 'type': 'pen_setPenColorToColor' },
                    { 'kind': 'block', 'type': 'pen_changePenSizeBy' },
                    { 'kind': 'block', 'type': 'pen_setPenSizeTo' }
                ]},
                { kind: 'sep' },
                { kind: 'category', name: 'Variables', colour: '#FF8C1A', custom: 'VARIABLE' },
                { kind: 'category', name: 'My Blocks', colour: '#FF6680', custom: 'PROCEDURE' }
            ]
        },
        initialXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="event_whenflagclicked" id="entry_point" x="100" y="100"></block></xml>'
    });

    const runCode = useCallback(async () => {
        if (!workspace) return;
        const code = javascriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
        
        const context = {
            move: (steps: number) => {
                const angle = (engineState.current.direction - 90) * (Math.PI / 180);
                engineState.current.x += steps * Math.cos(angle);
                engineState.current.y += steps * Math.sin(angle);
            },
            turn: (degrees: number) => {
                engineState.current.direction += degrees;
            },
            say: (message: string, duration?: number) => {
                engineState.current.message = String(message);
                if (duration) {
                    setTimeout(() => {
                        if (engineState.current.message === message) {
                            engineState.current.message = '';
                        }
                    }, duration * 1000);
                }
            },
            think: (message: string, duration?: number) => {
                engineState.current.message = String(message);
                 if (duration) {
                    setTimeout(() => {
                        if (engineState.current.message === message) {
                            engineState.current.message = '';
                        }
                    }, duration * 1000);
                }
            },
            changeSizeBy: (change: number) => {
                engineState.current.size += change;
            },
            setSizeTo: (size: number) => {
                engineState.current.size = size;
            },
            wait: (seconds: number) => {
                return new Promise(resolve => setTimeout(resolve, seconds * 1000));
            },
            nextCostume: () => {
                const sprite = sprites.find(s => s.id === activeSprite.id);
                if (sprite && sprite.costumes && sprite.costumes.length > 0) {
                    engineState.current.costumeIndex = (engineState.current.costumeIndex + 1) % sprite.costumes.length;
                }
            },
            setPen: (isDown: boolean) => {
                engineState.current.isPenDown = isDown;
            },
            penClear: () => {
                engineState.current.shouldClear = true;
            },
            setPenColor: (color: string) => {
                engineState.current.penColor = color;
            },
            playSound: (soundId: string) => {
                const sound = SOUND_LIBRARY.find(s => s.id === soundId);
                if (sound && sound.url) {
                    try {
                        const audio = new Audio(sound.url);
                        audio.play().catch(e => console.error("Audio playback error:", e));
                    } catch (e) {
                         console.error("Audio creation error:", e);
                    }
                }
            },
            isTouching: (object: string) => {
                return false;
            },
            getRandom: (min: number, max: number) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        };
        
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const func = new AsyncFunction(...Object.keys(context), `try { ${code} } catch(e) { console.error('Execution Error:', e); }`);

        try {
            await func(...Object.values(context));
        } catch (e) {
            console.error("Error executing generated code: ", e);
            toast({
                title: "Code Execution Error",
                description: e instanceof Error ? e.message : String(e),
                variant: "destructive",
            });
        }
    }, [workspace, activeSprite.id, sprites, toast]);
    
    // P5.js sketch setup
    useEffect(() => {
        if (typeof window === 'undefined' || !p5ContainerRef.current) {
            return;
        }
    
        let p5Instance: p5;
    
        const sketch = (p: p5) => {
            let penLayer: p5.Graphics;
    
            const preloadAssets = () => {
                const newImages: { [key: string]: p5.Image } = {};
                const assetsToLoad: { key: string; url: string }[] = [];
    
                sprites.forEach(sprite => {
                    if (sprite.costumes) {
                        sprite.costumes.forEach((url, index) => {
                            if (url && !url.startsWith('data:')) { // Only load actual URLs
                                assetsToLoad.push({ key: `${sprite.id}-${index}`, url });
                            }
                        });
                    }
                });
    
                backdrops.forEach(backdrop => {
                    if (backdrop.url) {
                        assetsToLoad.push({ key: backdrop.id, url: backdrop.url });
                    }
                });
    
                if (assetsToLoad.length === 0) {
                    setIsLoading(false);
                    return;
                }
    
                setIsLoading(true);
                let loadedCount = 0;
                const tempImages: { [key: string]: p5.Image } = {};
    
                assetsToLoad.forEach(({ key, url }) => {
                    p.loadImage(url, img => {
                        tempImages[key] = img;
                        loadedCount++;
                        if (loadedCount === assetsToLoad.length) {
                            setLoadedImages(prev => ({...prev, ...tempImages}));
                            setIsLoading(false);
                        }
                    }, err => {
                        console.error(`Failed to load image: ${url}`, err);
                        loadedCount++;
                        if (loadedCount === assetsToLoad.length) {
                             setLoadedImages(prev => ({...prev, ...tempImages}));
                            setIsLoading(false);
                        }
                    });
                });
            };
    
            p.setup = () => {
                const container = p5ContainerRef.current!;
                const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                canvas.parent(container);
                penLayer = p.createGraphics(p.width, p.height);
                p.frameRate(30);
    
                // Preload assets in setup
                preloadAssets();
            };
    
            p.draw = () => {
                // Background
                const bg = loadedImages[activeBackdrop.id];
                if (bg) {
                    p.image(bg, 0, 0, p.width, p.height);
                } else {
                    p.background(activeBackdrop.color || '#FFFFFF');
                }

                // Pen drawing
                if (engineState.current.shouldClear) {
                    penLayer.clear();
                    engineState.current.shouldClear = false;
                }

                if (engineState.current.isPenDown) {
                    penLayer.stroke(engineState.current.penColor);
                    penLayer.strokeWeight(4); // You can make this dynamic later
                    penLayer.line(
                        p.width / 2 + engineState.current.prevX,
                        p.height / 2 - engineState.current.prevY,
                        p.width / 2 + engineState.current.x,
                        p.height / 2 - engineState.current.y
                    );
                }
                p.image(penLayer, 0, 0); // Draw at (0,0) as it's a separate canvas layer

                // Sprite
                const costumeKey = `${activeSprite.id}-${engineState.current.costumeIndex}`;
                const currentCostumeImage = loadedImages[costumeKey];

                p.push();
                p.translate(p.width / 2 + engineState.current.x, p.height / 2 - engineState.current.y);
                p.rotate(p.radians(engineState.current.direction - 90));
                p.scale(engineState.current.size / 100);

                if (currentCostumeImage) {
                    p.imageMode(p.CENTER);
                    p.image(currentCostumeImage, 0, 0);
                } else {
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(50);
                    p.text(activeSprite.emoji, 0, 0);
                }
                p.pop();

                // Speech bubble
                if (engineState.current.message) {
                    p.fill(255);
                    p.stroke(0);
                    p.rect(p.width / 2 + engineState.current.x + 40, p.height / 2 - engineState.current.y - 60, 120, 40, 10);
                    p.fill(0);
                    p.noStroke();
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(engineState.current.message, p.width / 2 + engineState.current.x + 100, p.height / 2 - engineState.current.y - 45);
                }

                // Update prev positions
                engineState.current.prevX = engineState.current.x;
                engineState.current.prevY = engineState.current.y;
            };

            p.windowResized = () => {
                if (p5ContainerRef.current) {
                    p.resizeCanvas(p5ContainerRef.current.offsetWidth, p5ContainerRef.current.offsetHeight);
                    penLayer.resizeCanvas(p.width, p.height);
                }
            };
        };
        
        p5Instance = new p5(sketch, p5ContainerRef.current!);
        p5InstanceRef.current = p5Instance;
        
        return () => {
            if (p5Instance) {
                p5Instance.remove();
            }
        };
    }, []); // Only run once on mount

    const handleReset = () => {
        engineState.current = {
            x: 0, y: 0, prevX: 0, prevY: 0, direction: 90,
            size: 100, message: '', messageDuration: 0,
            isPenDown: false, penColor: '#000000', shouldClear: true, costumeIndex: 0
        };
        // The draw loop will handle the rest
    };


    const handleSpriteSelect = (sprite: any) => {
        engineState.current.costumeIndex = 0; // Reset costume on sprite change
        setActiveSprite(sprite);
    };

    const handleBackdropSelect = (backdrop: any) => {
        setActiveBackdrop(backdrop);
    };
    
    // This is a placeholder since the original component had these variables but they weren't defined.
    // Replace with your actual logic for fetching these.
    const canEdit = false;
    const refetchAssets = () => {};
    
    return (
        <div className="flex h-full bg-gray-100">
            {/* Left: Blockly */}
            <div className="w-2/3 h-full relative" ref={blocklyDivRef} style={{ resize: 'horizontal', overflow: 'auto' }}/>

            {/* Right: Stage, Sprites, etc. */}
            <div className="w-1/3 flex flex-col p-2 gap-2">
                
                {/* Stage */}
                <div className="relative aspect-video bg-white border border-gray-300 rounded" ref={p5ContainerRef}>
                    {isLoading && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>}
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button size="icon" onClick={runCode} className="bg-green-500 hover:bg-green-600"><Play className="h-5 w-5"/></Button>
                        <Button size="icon" variant="destructive" onClick={handleReset}><Square className="h-5 w-5"/></Button>
                    </div>
                </div>

                {/* Tabs for Sprites/Backdrops */}
                <Tabs defaultValue="sprites" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sprites">Sprites</TabsTrigger>
                        <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="sprites" className="flex-1 overflow-y-auto">
                        <div className="p-2 grid grid-cols-3 gap-2">
                            {sprites.map(sprite => (
                                <button key={sprite.id} onClick={() => handleSpriteSelect(sprite)} className={`p-2 rounded-lg border-2 ${activeSprite.id === sprite.id ? 'border-blue-500 bg-blue-100' : 'border-transparent bg-slate-100'}`}>
                                    <div className="text-4xl">{sprite.emoji}</div>
                                    <p className="text-xs">{sprite.name}</p>
                                </button>
                            ))}
                            {canEdit && <AddAssetModal type="sprite" onAdded={refetchAssets} />}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="backdrops" className="flex-1 overflow-y-auto">
                         <div className="p-2 grid grid-cols-3 gap-2">
                            {backdrops.map(backdrop => (
                                <button key={backdrop.id} onClick={() => handleBackdropSelect(backdrop)} className={`p-2 rounded-lg border-2 flex flex-col items-center ${activeBackdrop.id === backdrop.id ? 'border-blue-500' : 'border-transparent'}`}>
                                    <div className="w-16 h-12 rounded" style={{backgroundColor: backdrop.color}} />
                                    <p className="text-xs mt-1">{backdrop.name}</p>
                                </button>
                            ))}
                             {canEdit && <AddAssetModal type="backdrop" onAdded={refetchAssets} />}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// --- Helper Components ---

const AddAssetModal = ({ type, onAdded }: { type: 'sprite' | 'backdrop', onAdded: () => void }) => {
    // Basic modal structure
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                    <Plus className="h-8 w-8 text-gray-500"/>
                    <span className="text-xs mt-1">Add New</span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New {type}</DialogTitle>
                </DialogHeader>
                {/* Add form here to upload/add new assets */}
                <p>Asset creation UI goes here.</p>
            </DialogContent>
        </Dialog>
    );
};

export default ScratchEngine;
