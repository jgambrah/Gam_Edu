'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import p5 from 'p5';

export default function ScratchEngine() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<any>(null);

  // Sprite State
  const spriteData = useRef({
    x: 200,
    y: 200,
    direction: 0,
    img: 'https://scratch.mit.edu/static/assets/6727286395e546f3366f0766.svg' // Scratch Cat
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
    const sketch = (p: p5) => {
      let catImg: p5.Image;

      p.setup = () => {
        p.createCanvas(400, 400).parent(canvasRef.current!);
        catImg = p.loadImage(spriteData.current.img);
      };

      p.draw = () => {
        p.background(255); // Background Selection logic goes here
        p.imageMode(p.CENTER);
        
        p.push();
        p.translate(spriteData.current.x, spriteData.current.y);
        p.rotate(p.radians(spriteData.current.direction));
        p.image(catImg, 0, 0, 100, 100);
        p.pop();
      };
    };

    new p5(sketch);
  }, []);

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

    // 3. Execute
    try {
      // In a real app, use a safer Sandbox or JS-Interpreter
      const func = new Function('sprite', 'speakText', code);
      func(sprite, speakText);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
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
          
          {/* Character/Background Selector */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <p className="text-xs font-bold uppercase text-slate-400">Sprites & Stage</p>
            <div className="flex gap-2">
                <button className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-blue-500">🐱</button>
                <button className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">➕</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
