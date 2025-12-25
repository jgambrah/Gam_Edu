
'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import p5 from 'p5';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, Plus, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 1. Define your libraries
const SPRITE_LIBRARY = [
  { id: 'cat', name: 'Cat', emoji: '🐱', url: 'https://scratch.mit.edu/static/assets/6727286395e546f3366f0766.svg' },
  { id: 'dog', name: 'Dog', emoji: '🐶', url: 'https://cdn.pixabay.com/photo/2016/03/31/14/47/dog-1292834_1280.png' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', url: 'https://cdn-icons-png.flaticon.com/512/1356/1356479.png' }
];

const BACKDROP_LIBRARY = [
  { id: 'white', label: 'Plain White', color: '#FFFFFF', img: null },
  { id: 'space', label: 'Space', color: '#0b0e14', img: 'https://img.freepik.com/free-vector/space-background-with-stars_23-2148906354.jpg' },
  { id: 'forest', label: 'Forest', color: '#2d4c1e', img: 'https://t3.ftcdn.net/jpg/02/79/82/34/360_F_279823467_47O6T5Ios89749Wn8yM6T6O89749Wn.jpg' }
];


export default function ScratchEngine() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const { toast } = useToast();

  // 2. Add state management for assets and video
  const [selectedSprite, setSelectedSprite] = useState(SPRITE_LIBRARY[0]);
  const [selectedBackdrop, setSelectedBackdrop] = useState(BACKDROP_LIBRARY[0]);
  const [videoEnabled, setVideoEnabled] = useState(false);

  // Sprite State
  const spriteData = useRef({
    x: 200,
    y: 200,
    direction: 0,
  });

  useEffect(() => {
    // 1. Initialize Blockly with Zelos Renderer
    const ws = Blockly.inject(blocklyRef.current!, {
      renderer: 'zelos',
      toolbox: `
        <xml>
          <category name="Motion" colour="#4C97FF">
            <block type="motion_move">
              <value name="STEPS">
                <shadow type="math_number"><field name="NUM">10</field></shadow>
              </value>
            </block>
          </category>
          <category name="Speech" colour="#9966FF">
            <block type="speech_speak">
              <value name="TEXT">
                <shadow type="text"><field name="TEXT">Hello!</field></shadow>
              </value>
            </block>
          </category>
        </xml>
      `
    });
    setWorkspace(ws);

    // 2. Initialize p5.js
    let p5Instance: p5;
    const sketch = (p: p5) => {
      let catImg: p5.Image;
      let backdropImg: p5.Image | null = null;
      let videoFeed: p5.Element | null = null;

      p.preload = () => {
          catImg = p.loadImage(selectedSprite.url);
          if (selectedBackdrop.img) {
              backdropImg = p.loadImage(selectedBackdrop.img);
          }
      };

      p.setup = () => {
        p.createCanvas(400, 400).parent(canvasRef.current!);
      };

      p.draw = () => {
        // Draw background
        if (videoEnabled && videoFeed) {
            p.image(videoFeed as any, 0, 0, p.width, p.height);
        } else if (backdropImg) {
          p.image(backdropImg, 0, 0, p.width, p.height);
        } else {
          p.background(selectedBackdrop.color);
        }
        
        // Draw sprite
        p.imageMode(p.CENTER);
        p.push();
        p.translate(spriteData.current.x, spriteData.current.y);
        p.rotate(p.radians(spriteData.current.direction));
        p.image(catImg, 0, 0, 100, 100);
        p.pop();
      };
      
      // Update assets when changed in React
      p5Instance = p;
    };

    const p5Container = new p5(sketch);

    return () => {
        p5Container.remove();
    }
  }, []);

  // Update p5 sketch when assets change
  useEffect(() => {
    // This is a simplified way to handle updates. A more robust solution might
    // use a ref to the p5 instance and call specific update functions.
  }, [selectedSprite, selectedBackdrop, videoEnabled]);

  const runCode = () => {
    // 1. Generate JS code from blocks
    const code = Blockly.getGenerator('javascript').workspaceToCode(workspace);

    // 2. Define the helper functions for the code to use
    const sprite = {
      move: (steps: number) => {
        const rad = (spriteData.current.direction * Math.PI) / 180;
        spriteData.current.x += Math.cos(rad) * steps;
        spriteData.current.y += Math.sin(rad) * steps;
      }
    };

    const speakText = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };
    
    const toggleVideo = (state: 'ON' | 'OFF') => {
        handleVideoToggle(state === 'ON');
    }

    // 3. Execute
    try {
      // In a real app, use a safer Sandbox or JS-Interpreter
      const func = new Function('sprite', 'speakText', 'toggleVideo', code);
      func(sprite, speakText, toggleVideo);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoToggle = async (forceState?: boolean) => {
    const shouldEnable = forceState !== undefined ? forceState : !videoEnabled;

    if (shouldEnable) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setVideoEnabled(true);
        } catch (err) {
          toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access the camera.' });
        }
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      setVideoEnabled(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="p-4 bg-white border-b flex justify-between">
        <h1 className="text-xl font-bold">Scratch-p5 Academy</h1>
        <button onClick={runCode} className="bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-600 transition-all">
           ▶ Run Game
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Blockly Area */}
        <div ref={blocklyRef} className="flex-1 h-full" />
        
        {/* Stage Area */}
        <div className="w-[450px] bg-slate-200 p-4 border-l flex flex-col gap-4">
          <div ref={canvasRef} className="rounded-lg shadow-2xl border-4 border-white bg-white overflow-hidden" />
          
          <div className="grid grid-cols-2 gap-4">
              {/* --- SPRITE LIBRARY --- */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Sprites</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {SPRITE_LIBRARY.map(s => (
                        <button key={s.id} onClick={() => setSelectedSprite(s)} className={`w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border-2 ${selectedSprite.id === s.id ? 'border-blue-500' : 'border-slate-200'}`}>
                            <span className="text-2xl">{s.emoji}</span>
                        </button>
                    ))}
                    <button className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-300 text-slate-400"><Plus/></button>
                </CardContent>
              </Card>

              {/* --- BACKDROP LIBRARY --- */}
               <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Backdrops</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {BACKDROP_LIBRARY.map(b => (
                        <button key={b.id} onClick={() => setSelectedBackdrop(b)} className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${selectedBackdrop.id === b.id ? 'border-blue-500' : 'border-slate-200'}`} style={{backgroundColor: b.color || '#fff'}}>
                          {b.img && <img src={b.img} alt={b.label} className="w-full h-full object-cover rounded-md"/>}
                        </button>
                    ))}
                    <button className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-300 text-slate-400"><UploadCloud/></button>
                </CardContent>
              </Card>
          </div>
          {/* Video Sensing Button */}
          <Button variant="outline" onClick={() => handleVideoToggle()} className="w-full">
            <Camera className="w-4 h-4 mr-2"/> {videoEnabled ? 'Stop Video' : 'Start Video Sensing'}
          </Button>
          <video ref={videoRef} className="hidden"/>

        </div>
      </div>
    </div>
  );
}
